import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client';
import {
  FlowNodeType,
  FlowStatus,
  HttpMethod,
} from '../src/generated/prisma/enums';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const id = () => randomUUID();

const getWorkspaceIdArg = () => {
  const workspaceArg = process.argv.find(
    (arg) => arg.startsWith('--workspaceId=') || arg.startsWith('--workspace='),
  );

  return (
    workspaceArg?.split('=').at(1) ??
    process.env.WORKSPACE_ID ??
    process.env.SEED_WORKSPACE_ID
  );
};

const main = async () => {
  faker.seed(Number(process.env.SEED_FLOW_RANDOM_SEED ?? 20260525));

  const workspaceId = getWorkspaceIdArg();
  const workspaces = workspaceId
    ? await prisma.workspace.findMany({
        where: {
          id: workspaceId,
          deletedAt: null,
        },
      })
    : await prisma.workspace.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

  if (workspaceId && workspaces.length === 0) {
    throw new Error(`Workspace ${workspaceId} does not exist.`);
  }

  const workspaceRequests = await prisma.apiRequest.findMany({
    where: {
      deletedAt: null,
      collection: {
        workspaceId: {
          in: workspaces.map((workspace) => workspace.id),
        },
      },
    },
    select: {
      id: true,
      method: true,
      uri: true,
      collection: {
        select: {
          workspaceId: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const requestsByWorkspace = new Map<
    string,
    (typeof workspaceRequests)[number][]
  >();

  for (const request of workspaceRequests) {
    const requests = requestsByWorkspace.get(request.collection.workspaceId);

    if (requests) {
      requests.push(request);
    } else {
      requestsByWorkspace.set(request.collection.workspaceId, [request]);
    }
  }

  const runId = `${Date.now()}-${faker.string.alphanumeric({
    length: 8,
    casing: 'lower',
  })}`;
  const flows: any[] = [];
  const flowVariables: any[] = [];
  const flowNodes: any[] = [];
  const flowNodeApiRequests: any[] = [];
  const flowNodeConditions: any[] = [];
  const flowNodeDelays: any[] = [];
  const flowEdges: any[] = [];

  for (const workspace of workspaces) {
    const requests = requestsByWorkspace.get(workspace.id) ?? [];

    for (let flowIndex = 0; flowIndex < 2; flowIndex += 1) {
      const flowId = id();
      const apiNodeId = id();
      const conditionNodeId = id();
      const delayNodeId = id();
      const request =
        requests.length > 0 ? faker.helpers.arrayElement(requests) : undefined;

      flows.push({
        id: flowId,
        workspaceId: workspace.id,
        name: `${faker.hacker.verb()} ${faker.hacker.noun()} flow${
          flowIndex + 1
        }`,
        description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement([
          FlowStatus.DRAFT,
          FlowStatus.ACTIVE,
        ]),
        sortOrder: flowIndex,
      });

      flowVariables.push(
        {
          id: id(),
          flowId,
          key: 'baseUrl',
          value: faker.internet.url(),
          sortOrder: 0,
        },
        {
          id: id(),
          flowId,
          key: 'retryCount',
          value: String(faker.number.int({ min: 1, max: 3 })),
          sortOrder: 1,
        },
      );

      flowNodes.push(
        {
          id: apiNodeId,
          flowId,
          type: FlowNodeType.API_REQUEST,
          label: 'Send request',
          description: faker.lorem.sentence(),
          positionX: 120,
          positionY: 120,
          sortOrder: 0,
        },
        {
          id: conditionNodeId,
          flowId,
          type: FlowNodeType.CONDITION,
          label: 'Check status',
          description: faker.lorem.sentence(),
          positionX: 420,
          positionY: 120,
          sortOrder: 1,
        },
        {
          id: delayNodeId,
          flowId,
          type: FlowNodeType.DELAY,
          label: 'Wait before retry',
          description: faker.lorem.sentence(),
          positionX: 720,
          positionY: 120,
          sortOrder: 2,
        },
      );

      flowNodeApiRequests.push({
        id: id(),
        nodeId: apiNodeId,
        requestId: request?.id ?? null,
        method: request?.method ?? HttpMethod.GET,
        uri: request?.uri ?? faker.internet.url(),
        timeoutMs: faker.number.int({ min: 5000, max: 30000 }),
        continueOnError: true,
      });

      flowNodeConditions.push({
        id: id(),
        nodeId: conditionNodeId,
        expression: 'response.statusCode >= 200 && response.statusCode < 300',
      });

      flowNodeDelays.push({
        id: id(),
        nodeId: delayNodeId,
        durationMs: faker.number.int({ min: 250, max: 3000 }),
      });

      flowEdges.push(
        {
          id: id(),
          flowId,
          sourceNodeId: apiNodeId,
          targetNodeId: conditionNodeId,
          label: 'response',
          sourceHandle: 'success',
          targetHandle: 'input',
          sortOrder: 0,
        },
        {
          id: id(),
          flowId,
          sourceNodeId: conditionNodeId,
          targetNodeId: delayNodeId,
          label: 'retry',
          sourceHandle: 'false',
          targetHandle: 'input',
          conditionExpression: 'response.statusCode >= 500',
          sortOrder: 1,
        },
      );
    }
  }

  await prisma.$transaction([
    prisma.flow.createMany({ data: flows }),
    prisma.flowVariable.createMany({ data: flowVariables }),
    prisma.flowNode.createMany({ data: flowNodes }),
    prisma.flowNodeApiRequest.createMany({ data: flowNodeApiRequests }),
    prisma.flowNodeCondition.createMany({ data: flowNodeConditions }),
    prisma.flowNodeDelay.createMany({ data: flowNodeDelays }),
    prisma.flowEdge.createMany({ data: flowEdges }),
  ]);

  console.log('Flow seed completed');
  console.table({
    workspaces: workspaces.length,
    flows: flows.length,
    flowVariables: flowVariables.length,
    flowNodes: flowNodes.length,
    flowEdges: flowEdges.length,
  });
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
