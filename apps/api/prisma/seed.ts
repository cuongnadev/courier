import 'dotenv/config';

import { randomUUID } from 'node:crypto';

import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../src/generated/prisma/client';
import {
  ApiKeyLocation,
  AuthType,
  BodyParamType,
  HttpMethod,
  RequestBodyType,
  RequestRunStatus,
  RawBodyLanguage,
  UserGender,
  WorkspaceRole,
} from '../src/generated/prisma/enums';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

const id = () => randomUUID();

type SeedUser = {
  id: string;
};

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

const seedConfig = {
  users: getNonNegativeInt('U', 'SEED_USERS', 1),
  workspacesPerUser: getNonNegativeInt('M', 'SEED_WORKSPACES_PER_USER', 2),
  collectionsPerWorkspace: getNonNegativeInt(
    'N',
    'SEED_COLLECTIONS_PER_WORKSPACE',
    3,
  ),
  requestsPerCollection: getNonNegativeInt(
    'P',
    'SEED_REQUESTS_PER_COLLECTION',
    5,
  ),
  runsPerRequest: getNonNegativeInt('Q', 'SEED_RUNS_PER_REQUEST', 4),
};

const httpMethods = [
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.PATCH,
  HttpMethod.DELETE,
];

const runStatuses = [
  RequestRunStatus.SUCCESS,
  RequestRunStatus.SUCCESS,
  RequestRunStatus.SUCCESS,
  RequestRunStatus.FAILED,
];

const collectionColors = [
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#14B8A6',
];

const createRequestBody = (method: HttpMethod) => {
  if (method === HttpMethod.GET || method === HttpMethod.DELETE) {
    return null;
  }

  return JSON.stringify({
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 12 }),
    active: faker.datatype.boolean(),
  });
};

const createSeedUsers = async () => {
  const seedStamp = Date.now();
  const users = Array.from({ length: seedConfig.users }, (_, index) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      id: id(),
      fullName: `${firstName} ${lastName}`,
      email: `seed.user.${seedStamp}.${index}@courier.local`,
      photoUrl: faker.image.avatar(),
      passwordHash: faker.internet.password({ length: 32 }),
      age: faker.number.int({ min: 18, max: 70 }),
      gender: faker.helpers.arrayElement([
        UserGender.MALE,
        UserGender.FEMALE,
        UserGender.OTHER,
      ]),
    };
  });

  if (users.length > 0) {
    await prisma.user.createMany({ data: users });
  }

  return users;
};

const main = async () => {
  faker.seed(Number(process.env.SEED_RANDOM_SEED ?? 20260525));

  let users: SeedUser[] = await prisma.user.findMany({
    select: {
      id: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (users.length === 0 && seedConfig.users > 0) {
    users = await createSeedUsers();
  }

  const runId = `${Date.now()}-${faker.string.alphanumeric({
    length: 8,
    casing: 'lower',
  })}`;
  const workspaces: any[] = [];
  const workspaceMembers: any[] = [];
  const collections: any[] = [];
  const requests: any[] = [];
  const requestAuth: any[] = [];
  const requestHeaders: any[] = [];
  const requestQueryParams: any[] = [];
  const requestPathParams: any[] = [];
  const requestBodyParams: any[] = [];
  const requestCookies: any[] = [];
  const requestExamples: any[] = [];
  const requestExampleHeaders: any[] = [];
  const requestRuns: any[] = [];
  const requestRunHeaders: any[] = [];
  const requestRunResponseHeaders: any[] = [];

  for (const user of users) {
    for (
      let workspaceIndex = 0;
      workspaceIndex < seedConfig.workspacesPerUser;
      workspaceIndex += 1
    ) {
      const workspaceId = id();

      workspaces.push({
        id: workspaceId,
        name: `${faker.company.name()} ${faker.company.buzzVerb()} ${
          workspaceIndex + 1
        }`,
        description: faker.company.catchPhrase(),
        ownerId: user.id,
      });

      workspaceMembers.push({
        id: id(),
        workspaceId,
        userId: user.id,
        role: WorkspaceRole.OWNER,
      });

      for (
        let collectionIndex = 0;
        collectionIndex < seedConfig.collectionsPerWorkspace;
        collectionIndex += 1
      ) {
        const collectionId = id();

        collections.push({
          id: collectionId,
          workspaceId,
          name: `${faker.hacker.noun()} ${faker.hacker.ingverb()} ${
            collectionIndex + 1
          }`,
          description: faker.lorem.sentence(),
          color: faker.helpers.arrayElement(collectionColors),
          sortOrder: collectionIndex,
        });

        for (
          let requestIndex = 0;
          requestIndex < seedConfig.requestsPerCollection;
          requestIndex += 1
        ) {
          const requestId = id();
          const method = faker.helpers.arrayElement(httpMethods);
          const rawBody = createRequestBody(method);
          const uri = `${faker.internet.url()}/api/:resourceId`;

          requests.push({
            id: requestId,
            collectionId,
            name: `${faker.hacker.verb()} ${faker.hacker.noun()}`,
            method,
            uri,
            bodyType: rawBody ? RequestBodyType.RAW : RequestBodyType.NONE,
            rawBodyLanguage: RawBodyLanguage.JSON,
            rawBody,
            graphqlQuery:
              method === HttpMethod.POST && faker.datatype.boolean()
                ? 'query GetResource($id: ID!) { resource(id: $id) { id name } }'
                : null,
            graphqlVariables:
              method === HttpMethod.POST && faker.datatype.boolean()
                ? JSON.stringify({ id: id() })
                : null,
            description: faker.lorem.sentence(),
            sortOrder: requestIndex,
          });

          requestAuth.push({
            id: id(),
            requestId,
            type: AuthType.API_KEY,
            apiKeyName: 'X-API-Key',
            apiKeyValue: faker.string.alphanumeric(32),
            apiKeyLocation: ApiKeyLocation.HEADER,
          });

          requestHeaders.push(
            {
              id: id(),
              requestId,
              key: 'Content-Type',
              value: 'application/json',
              sortOrder: 0,
            },
            {
              id: id(),
              requestId,
              key: 'X-Request-Id',
              value: id(),
              sortOrder: 1,
            },
          );

          requestQueryParams.push(
            {
              id: id(),
              requestId,
              key: 'page',
              value: String(faker.number.int({ min: 1, max: 10 })),
              sortOrder: 0,
            },
            {
              id: id(),
              requestId,
              key: 'limit',
              value: String(faker.number.int({ min: 10, max: 100 })),
              sortOrder: 1,
            },
          );

          requestPathParams.push({
            id: id(),
            requestId,
            key: 'resourceId',
            value: id(),
            sortOrder: 0,
          });

          if (rawBody) {
            requestBodyParams.push(
              {
                id: id(),
                requestId,
                key: 'name',
                value: faker.commerce.productName(),
                type: BodyParamType.TEXT,
                sortOrder: 0,
              },
              {
                id: id(),
                requestId,
                key: 'quantity',
                value: String(faker.number.int({ min: 1, max: 12 })),
                type: BodyParamType.TEXT,
                sortOrder: 1,
              },
            );
          }

          requestCookies.push({
            id: id(),
            requestId,
            name: 'session_id',
            value: faker.string.alphanumeric(24),
            domain: faker.internet.domainName(),
            path: '/',
            sortOrder: 0,
          });

          const exampleId = id();

          requestExamples.push({
            id: exampleId,
            requestId,
            name: 'Successful response',
            statusCode: 200,
            responseBody: JSON.stringify({
              id: id(),
              name: faker.commerce.productName(),
            }),
            responseTimeMs: faker.number.int({ min: 20, max: 500 }),
            sortOrder: 0,
          });

          requestExampleHeaders.push({
            id: id(),
            exampleId,
            key: 'Content-Type',
            value: 'application/json',
          });

          for (
            let runIndex = 0;
            runIndex < seedConfig.runsPerRequest;
            runIndex += 1
          ) {
            const runId = id();
            const status = faker.helpers.arrayElement(runStatuses);
            const statusCode =
              status === RequestRunStatus.SUCCESS
                ? faker.helpers.arrayElement([200, 201, 202, 204])
                : faker.helpers.arrayElement([400, 401, 404, 422, 500]);
            const responseBody = JSON.stringify({
              id: id(),
              message: faker.hacker.phrase(),
              timestamp: faker.date.recent().toISOString(),
            });

            requestRuns.push({
              id: runId,
              workspaceId,
              requestId,
              userId: user.id,
              method,
              uri,
              status,
              statusCode,
              durationMs: faker.number.int({ min: 20, max: 2500 }),
              requestBody: rawBody,
              responseBody,
              responseSize: Buffer.byteLength(responseBody),
              errorMessage:
                status === RequestRunStatus.FAILED
                  ? faker.hacker.phrase()
                  : null,
              createdAt: faker.date.recent({ days: 30 }),
            });

            requestRunHeaders.push({
              id: id(),
              runId,
              key: 'User-Agent',
              value: faker.internet.userAgent(),
            });

            requestRunResponseHeaders.push({
              id: id(),
              runId,
              key: 'Content-Type',
              value: 'application/json',
            });
          }
        }
      }
    }
  }

  await prisma.$transaction([
    prisma.workspace.createMany({ data: workspaces }),
    prisma.workspaceMember.createMany({ data: workspaceMembers }),
    prisma.collection.createMany({ data: collections }),
    prisma.apiRequest.createMany({ data: requests }),
    prisma.requestAuth.createMany({ data: requestAuth }),
    prisma.requestHeader.createMany({ data: requestHeaders }),
    prisma.requestQueryParam.createMany({ data: requestQueryParams }),
    prisma.requestPathParam.createMany({ data: requestPathParams }),
    prisma.requestBodyParam.createMany({ data: requestBodyParams }),
    prisma.requestCookie.createMany({ data: requestCookies }),
    prisma.requestExample.createMany({ data: requestExamples }),
    prisma.requestExampleHeader.createMany({ data: requestExampleHeaders }),
    prisma.requestRun.createMany({ data: requestRuns }),
    prisma.requestRunHeader.createMany({ data: requestRunHeaders }),
    prisma.requestRunResponseHeader.createMany({
      data: requestRunResponseHeaders,
    }),
  ]);

  console.log('Seed completed');
  console.table({
    users: users.length,
    workspaces: workspaces.length,
    collections: collections.length,
    requests: requests.length,
    requestAuth: requestAuth.length,
    requestHeaders: requestHeaders.length,
    requestQueryParams: requestQueryParams.length,
    requestPathParams: requestPathParams.length,
    requestBodyParams: requestBodyParams.length,
    requestCookies: requestCookies.length,
    requestExamples: requestExamples.length,
    requestRuns: requestRuns.length,
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
