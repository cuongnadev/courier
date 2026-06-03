import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const id = () => randomUUID();

const getNonNegativeInt = (
  shortName: string,
  longName: string,
  defaultValue: number,
) => {
  const rawValue = process.env[shortName] ?? process.env[longName];
  const value = Number(rawValue ?? defaultValue);

  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${longName} must be a non-negative integer.`);
  }

  return value;
};

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

const seedConfig = {
  testcasesPerRequest: getNonNegativeInt('T', 'SEED_TESTCASES_PER_REQUEST', 2),
};

const parseJsonBody = (body: string | null) => {
  if (!body) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(body);

    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : { value: parsed };
  } catch {
    return {
      value: body,
    };
  }
};

const createPositiveBody = (rawBody: string | null) => ({
  ...parseJsonBody(rawBody),
  username: faker.internet.username(),
  password: faker.internet.password({ length: 12 }),
  externals: {
    redirect: true,
    shouldPrompt: true,
    versionId: id(),
  },
});

const createNegativeBody = (rawBody: string | null) => ({
  ...parseJsonBody(rawBody),
  username: '',
  password: '',
  externals: {
    redirect: false,
    shouldPrompt: false,
    versionId: null,
  },
});

const main = async () => {
  faker.seed(Number(process.env.SEED_TESTCASE_RANDOM_SEED ?? 20260525));

  const workspaceId = getWorkspaceIdArg();

  if (workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!workspace) {
      throw new Error(`Workspace ${workspaceId} does not exist.`);
    }
  }

  const requests = await prisma.apiRequest.findMany({
    where: {
      deletedAt: null,
      collection: {
        deletedAt: null,
        ...(workspaceId ? { workspaceId } : {}),
      },
    },
    select: {
      id: true,
      name: true,
      rawBody: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const requestTestcases = requests.flatMap((request) =>
    Array.from({ length: seedConfig.testcasesPerRequest }, (_, index) => {
      const isPositiveCase = index % 2 === 0;

      return {
        id: id(),
        requestId: request.id,
        name: isPositiveCase
          ? `${request.name} positive case ${index + 1}`
          : `${request.name} negative case ${index + 1}`,
        description: isPositiveCase
          ? 'Seeded positive request testcase.'
          : 'Seeded negative request testcase.',
        expectedStatus: isPositiveCase
          ? faker.helpers.arrayElement([200, 201, 202, 204])
          : faker.helpers.arrayElement([400, 401, 403, 404, 422, 500]),
        isPositiveCase,
        moddedBody: JSON.stringify(
          isPositiveCase
            ? createPositiveBody(request.rawBody)
            : createNegativeBody(request.rawBody),
        ),
      };
    }),
  );

  if (requestTestcases.length > 0) {
    await prisma.requestTestcase.createMany({
      data: requestTestcases,
    });
  }

  console.log('Request testcase seed completed');
  console.table({
    requests: requests.length,
    testcasesPerRequest: seedConfig.testcasesPerRequest,
    requestTestcases: requestTestcases.length,
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
