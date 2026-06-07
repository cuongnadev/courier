import { Injectable } from '@nestjs/common';

import { AppException } from '@/common/exceptions/app.exceptions';
import {
  HttpMethod,
  RawBodyLanguage,
  RequestBodyType,
  RequestRunStatus,
} from '@/generated/prisma/enums';

import { getTodayRange } from '../../common/utils/date-range.util';
import { PrismaService } from '../../database/prisma.service';
import { CollectionsService } from '../collections';
import { WorkspacesService } from '../workspaces';

import { CreateAndRunRequestDto } from './dto/create-and-run-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { RunRequestDto } from './dto/run-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { GenerateTestCasesDto } from './dto/generate-test-cases.dto';

import { appConfig } from '@/config/app.config';

type RunHeaderInput = {
  key: string;
  value?: string | null;
  enabled?: boolean;
};

type RunHeaderRow = {
  key: string;
  value: string;
};

type RequestRunWithHeaders = {
  id: string;
  workspaceId: string;
  requestId: string | null;
  userId: string | null;
  environmentId: string | null;

  method: HttpMethod;
  uri: string;

  status: RequestRunStatus;
  statusCode: number | null;
  durationMs: number | null;

  requestBody: string | null;
  responseBody: string | null;
  responseSize: number | null;
  errorMessage: string | null;

  createdAt: Date;

  requestHeaders?: Array<{
    key: string;
    value: string | null;
  }>;

  responseHeaders?: Array<{
    key: string;
    value: string | null;
  }>;
};

type GeneratedTestCase = {
  name: string;
  expectedStatus: number;
  body: unknown;
  isPositiveCase: boolean;
};

type SavedRequestTestCase = {
  id: string;
  requestId: string;
  name: string;
  description: string | null;
  expectedStatus: number;
  body: unknown;
  isPositiveCase: boolean;
  enabled: boolean;
};

type GenerateTestCasesResponse = {
  testCases: SavedRequestTestCase[];
  testCasesCount: number;
};

type FindTestCasesResponse = {
  testCases: SavedRequestTestCase[];
  testCasesCount: number;
};

type DeleteTestCaseResponse = {
  deleted: boolean;
  id: string;
};

type GenerateTestCasesModelPayload = {
  request: {
    id: string;
    collection_id: string;
    name: string;
    description: string;
    method: string;
    uri: string;
    raw_body: string;
    created_at: string;
    updated_at: string;
  };
  prompt: string;
};

type GenerateTestCasesModelResponse = {
  generatedTestCases?: Array<{
    name?: unknown;
    expectedStatus?: unknown;
    body?: unknown;
    isPositiveCase?: unknown;
  }>;
  testCasesCount?: unknown;
};

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspacesService,
    private readonly collectionsService: CollectionsService,
  ) { }

  async create(
    workspaceId: string,
    collectionId: string,
    userId: string | undefined,
    dto: CreateRequestDto,
  ) {
    await this.workspaceService.assertAccess(workspaceId, userId);
    await this.collectionsService.assertInWorkspace(collectionId, workspaceId);

    const request = await this.prisma.apiRequest.create({
      data: {
        collectionId,
        name: dto.name,
        method: dto.method,
        uri: dto.uri,
        bodyType: dto.bodyType,
        rawBodyLanguage: dto.rawBodyLanguage,
        rawBody: dto.rawBody,
        graphqlQuery: dto.graphqlQuery,
        graphqlVariables: dto.graphqlVariables,
        description: dto.description,
        sortOrder: dto.sortOrder,
      },
    });

    return this.findOne(request.id, workspaceId, userId);
  }

  async run(
    workspaceId: string,
    collectionId: string,
    requestId: string,
    userId: string | undefined,
    dto: RunRequestDto,
  ) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    await this.prisma.apiRequest.findFirstOrThrow({
      where: {
        id: requestId,
        collectionId,
        deletedAt: null,
        collection: {
          id: collectionId,
          workspaceId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    return this.executeRequestRun({
      workspaceId,
      requestId,
      userId,
      method: dto.method,
      uri: dto.uri,
      bodyType: dto.bodyType,
      rawBody: dto.rawBody ?? null,
      headers: dto.headers,
    });
  }

  async createAndRun(
    workspaceId: string,
    collectionId: string,
    userId: string | undefined,
    dto: CreateAndRunRequestDto,
  ) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    await this.prisma.collection.findFirstOrThrow({
      where: {
        id: collectionId,
        workspaceId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    const method = dto.method ?? HttpMethod.GET;
    const bodyType = dto.bodyType ?? RequestBodyType.NONE;
    const rawBodyLanguage = dto.rawBodyLanguage ?? RawBodyLanguage.JSON;

    const request = await this.prisma.apiRequest.create({
      data: {
        collectionId,

        name: dto.name,
        method,
        uri: dto.uri,

        bodyType,
        rawBodyLanguage,

        rawBody: dto.rawBody ?? null,
        graphqlQuery: dto.graphqlQuery ?? null,
        graphqlVariables: dto.graphqlVariables ?? null,

        description: dto.description ?? null,
        sortOrder: dto.sortOrder ?? 0,

        headers: {
          create:
            dto.headers?.map((header, index) => ({
              key: header.key,
              value: header.value ?? '',
              enabled: header.enabled ?? true,
              sortOrder: index,
            })) ?? [],
        },
      },
      include: {
        headers: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        _count: {
          select: {
            headers: true,
          },
        },
      },
    });

    const run = await this.executeRequestRun({
      workspaceId,
      requestId: request.id,
      userId,
      method,
      uri: dto.uri,
      bodyType,
      rawBody: dto.rawBody ?? null,
      headers: dto.headers,
    });

    return {
      request: this.toRequestResponse(request),
      run,
    };
  }

  async findAllByCollection(
    workspaceId: string,
    collectionId: string,
    userId?: string,
  ) {
    await this.workspaceService.assertAccess(workspaceId, userId);
    await this.collectionsService.assertInWorkspace(collectionId, workspaceId);

    const requests = await this.prisma.apiRequest.findMany({
      where: {
        collectionId,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            headers: true,
          },
        },
      },
    });

    return requests.map((request) => this.toRequestListItem(request));
  }

  async findAllByWorkspace(
    workspaceId: string,
    userId?: string,
    limit?: number,
  ) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const requests = await this.prisma.apiRequest.findMany({
      where: {
        deletedAt: null,
        collection: {
          workspaceId,
          deletedAt: null,
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
      take: limit,
      include: {
        _count: {
          select: {
            headers: true,
          },
        },
      },
    });

    return requests.map((request) => this.toRequestListItem(request));
  }

  async findRecentRunsByWorkspace(
    workspaceId: string,
    userId?: string,
    limit?: number,
  ) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const runs = await this.prisma.requestRun.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        requestId: true,
        method: true,
        uri: true,
        status: true,
        statusCode: true,
        durationMs: true,
        createdAt: true,
        request: {
          select: {
            name: true,
            deletedAt: true,
          },
        },
      },
    });

    return runs.map((run) => ({
      id: run.id,
      method: run.method,
      requestId: run.requestId,
      name:
        run.request && !run.request.deletedAt
          ? run.request.name
          : 'Untitled Request',
      uri: run.uri,
      status: run.status,
      statusCode: run.statusCode,
      durationMs: run.durationMs,
      createdAt: run.createdAt.toISOString(),
    }));
  }

  async findOne(requestId: string, workspaceId: string, userId?: string) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    const request = await this.prisma.apiRequest.findFirst({
      where: {
        id: requestId,
        deletedAt: null,
        collection: {
          workspaceId,
          deletedAt: null,
        },
      },

      include: {
        collection: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
          },
        },

        auth: true,

        headers: {
          orderBy: {
            sortOrder: 'asc',
          },
        },

        queryParams: {
          orderBy: {
            sortOrder: 'asc',
          },
        },

        pathParams: {
          orderBy: {
            sortOrder: 'asc',
          },
        },

        bodyParams: {
          orderBy: {
            sortOrder: 'asc',
          },
        },

        cookies: {
          orderBy: {
            sortOrder: 'asc',
          },
        },

        examples: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            headers: true,
          },
        },

        _count: {
          select: {
            headers: true,
            queryParams: true,
            pathParams: true,
            bodyParams: true,
            cookies: true,
            examples: true,
          },
        },
      },
    });

    if (!request) {
      throw new AppException({
        code: 'NOT_FOUND',
        message: 'Request not found.',
        status: 404,
        hint: 'The requested API request does not exist.',
        docs: '',
      });
    }

    const { _count, ...data } = request;

    return {
      ...data,
      headersCount: _count.headers,
      queryParamsCount: _count.queryParams,
      pathParamsCount: _count.pathParams,
      bodyParamsCount: _count.bodyParams,
      cookiesCount: _count.cookies,
      examplesCount: _count.examples,
      hasBody: data.bodyType !== 'NONE',
    };
  }

  async findOneByCollection(
    workspaceId: string,
    collectionId: string,
    requestId: string,
    userId: string | undefined,
  ) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const request = await this.prisma.apiRequest.findFirstOrThrow({
      where: {
        id: requestId,
        collectionId,
        deletedAt: null,
        collection: {
          id: collectionId,
          workspaceId,
          deletedAt: null,
        },
      },
      include: {
        headers: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        _count: {
          select: {
            headers: true,
          },
        },
      },
    });

    return this.toRequestResponse(request);
  }

  async update(
    requestId: string,
    workspaceId: string,
    userId: string | undefined,
    dto: UpdateRequestDto,
  ) {
    await this.findOne(requestId, workspaceId, userId);

    const { headers, ...requestData } = dto;

    await this.prisma.apiRequest.update({
      where: {
        id: requestId,
      },
      data: requestData,
    });

    if (headers) {
      await this.prisma.requestHeader.deleteMany({
        where: {
          requestId,
        },
      });

      if (headers.length > 0) {
        await this.prisma.requestHeader.createMany({
          data: headers.map((header, index) => ({
            requestId,
            key: header.key,
            value: header.value ?? '',
            enabled: header.enabled ?? true,
            sortOrder: index,
          })),
        });
      }
    }

    return this.findOne(requestId, workspaceId, userId);
  }

  async remove(requestId: string, workspaceId: string, userId?: string) {
    await this.findOne(requestId, workspaceId, userId);

    return this.prisma.apiRequest.update({
      where: {
        id: requestId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.apiRequest.count({
      where: {
        deletedAt: null,
        collection: {
          workspaceId,
          deletedAt: null,
        },
      },
    });
  }

  async countRunsByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.requestRun.count({
      where: {
        workspaceId,
      },
    });
  }

  async generateTestCases(
    workspaceId: string,
    collectionId: string,
    requestId: string,
    userId: string | undefined,
    dto: GenerateTestCasesDto,
  ): Promise<GenerateTestCasesResponse> {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const request = await this.prisma.apiRequest.findFirst({
      where: {
        id: requestId,
        collectionId,
        deletedAt: null,
        collection: {
          id: collectionId,
          workspaceId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
        collectionId: true,
        name: true,
        description: true,
        method: true,
        uri: true,
        rawBody: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!request) {
      throw new AppException({
        code: 'NOT_FOUND',
        message: 'Request not found.',
        status: 404,
        hint: 'The request does not exist in this collection.',
        docs: '',
      });
    }

    const payload: GenerateTestCasesModelPayload = {
      request: {
        id: request.id,
        collection_id: request.collectionId,
        name: request.name,
        description: request.description ?? '',
        method: request.method,
        uri: request.uri,
        raw_body: request.rawBody ?? '',
        created_at: request.createdAt.toISOString(),
        updated_at: request.updatedAt.toISOString(),
      },
      prompt:
        dto.prompt?.trim() ||
        'Generate test cases including missing body fields',
    };

    const modelResponse = await this.callGenerateTestCasesModel(payload);
    const generatedTestCases = this.normalizeGeneratedTestCases(modelResponse);

    await this.prisma.requestTestcase.deleteMany({
      where: {
        requestId,
      },
    });

    if (generatedTestCases.length > 0) {
      await this.prisma.requestTestcase.createMany({
        data: generatedTestCases.map((testCase) => ({
          requestId,
          name: testCase.name,
          description: null,
          expectedStatus: testCase.expectedStatus,
          isPositiveCase: testCase.isPositiveCase,
          moddedBody: this.stringifyTestCaseBody(testCase.body),
        })),
      });
    }

    const savedTestCases = await this.prisma.requestTestcase.findMany({
      where: {
        requestId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      testCases: savedTestCases.map((testCase) =>
        this.serializeRequestTestCase(testCase),
      ),
      testCasesCount: savedTestCases.length,
    };
  }

  async countSuccessfulRunsToday(workspaceId: string): Promise<number> {
    const today = getTodayRange();

    return this.prisma.requestRun.count({
      where: {
        workspaceId,
        status: RequestRunStatus.SUCCESS,
        createdAt: {
          gte: today.start,
          lt: today.end,
        },
      },
    });
  }

  async getUserRunActivity(workspaceId: string, userId: string, days = 365) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const normalizedDays = Math.min(Math.max(days, 1), 365);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (normalizedDays - 1));

    const runs = await this.prisma.requestRun.findMany({
      where: {
        workspaceId,
        userId,
        createdAt: {
          gte: start,
        },
      },
      select: {
        status: true,
        durationMs: true,
        responseSize: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const daysByKey = new Map<
      string,
      {
        date: string;
        runs: number;
        successfulRuns: number;
        failedRuns: number;
        durationTotalMs: number;
        responseSizeTotal: number;
      }
    >();

    for (let offset = 0; offset < normalizedDays; offset += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + offset);

      const date = this.toDateKey(day);
      daysByKey.set(date, {
        date,
        runs: 0,
        successfulRuns: 0,
        failedRuns: 0,
        durationTotalMs: 0,
        responseSizeTotal: 0,
      });
    }

    for (const run of runs) {
      const date = this.toDateKey(run.createdAt);
      const day = daysByKey.get(date);

      if (!day) continue;

      day.runs += 1;
      day.durationTotalMs += run.durationMs ?? 0;
      day.responseSizeTotal += run.responseSize ?? 0;

      if (run.status === RequestRunStatus.SUCCESS) {
        day.successfulRuns += 1;
      } else if (run.status === RequestRunStatus.FAILED) {
        day.failedRuns += 1;
      }
    }

    const activity = Array.from(daysByKey.values()).map((day) => ({
      ...day,
      averageDurationMs:
        day.runs > 0 ? Math.round(day.durationTotalMs / day.runs) : 0,
    }));

    const totalRuns = runs.length;
    const successfulRuns = runs.filter(
      (run) => run.status === RequestRunStatus.SUCCESS,
    ).length;
    const failedRuns = runs.filter(
      (run) => run.status === RequestRunStatus.FAILED,
    ).length;
    const averageDurationMs =
      totalRuns > 0
        ? Math.round(
          runs.reduce((total, run) => total + (run.durationMs ?? 0), 0) /
          totalRuns,
        )
        : 0;
    const totalResponseSize = runs.reduce(
      (total, run) => total + (run.responseSize ?? 0),
      0,
    );

    return {
      totalRuns,
      successfulRuns,
      failedRuns,
      successRate:
        totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0,
      averageDurationMs,
      totalResponseSize,
      activeDays: activity.filter((day) => day.runs > 0).length,
      days: activity,
    };
  }

  async assertWorkspaceAccess(
    workspaceId: string,
    userId?: string,
  ): Promise<void> {
    await this.workspaceService.assertAccess(workspaceId, userId);
  }

  async findTestCases(
    workspaceId: string,
    collectionId: string,
    requestId: string,
    userId: string | undefined,
  ): Promise<FindTestCasesResponse> {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const request = await this.prisma.apiRequest.findFirst({
      where: {
        id: requestId,
        collectionId,
        deletedAt: null,
        collection: {
          id: collectionId,
          workspaceId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (!request) {
      throw new AppException({
        code: 'NOT_FOUND',
        message: 'Request not found.',
        status: 404,
        hint: 'The request does not exist in this collection.',
        docs: '',
      });
    }

    const testCases = await this.prisma.requestTestcase.findMany({
      where: {
        requestId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return {
      testCases: testCases.map((testCase) =>
        this.serializeRequestTestCase(testCase),
      ),
      testCasesCount: testCases.length,
    };
  }

  async deleteTestCase(
    workspaceId: string,
    collectionId: string,
    requestId: string,
    testCaseId: string,
    userId: string | undefined,
  ): Promise<DeleteTestCaseResponse> {
    await this.assertWorkspaceAccess(workspaceId, userId);

    const testCase = await this.prisma.requestTestcase.findFirst({
      where: {
        id: testCaseId,
        requestId,
        request: {
          id: requestId,
          collectionId,
          deletedAt: null,
          collection: {
            id: collectionId,
            workspaceId,
            deletedAt: null,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!testCase) {
      throw new AppException({
        code: 'NOT_FOUND',
        message: 'Test case not found.',
        status: 404,
        hint: 'The requested test case does not exist.',
        docs: '',
      });
    }

    await this.prisma.requestTestcase.delete({
      where: {
        id: testCaseId,
      },
    });

    return {
      deleted: true,
      id: testCaseId,
    };
  }

  private toRequestListItem(request: {
    id: string;
    collectionId: string;
    name: string;
    method: HttpMethod;
    uri: string;
    bodyType: RequestBodyType;
    rawBodyLanguage: RawBodyLanguage;
    rawBody: string | null;
    graphqlQuery: string | null;
    graphqlVariables: string | null;
    description: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    _count: {
      headers: number;
    };
  }) {
    const { _count, ...data } = request;

    return {
      ...data,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      deletedAt: data.deletedAt?.toISOString() ?? null,
      headersCount: _count.headers,
      hasBody: data.bodyType !== 'NONE',
    };
  }

  private toRequestResponse<
    T extends {
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      bodyType: string;
      headers?: Array<{
        id: string;
        requestId: string;
        key: string;
        value: string | null;
        enabled: boolean;
        sortOrder: number;
      }>;
      _count?: {
        headers?: number;
      };
    },
  >(request: T) {
    return {
      ...request,
      createdAt: request.createdAt.toISOString(),
      updatedAt: request.updatedAt.toISOString(),
      deletedAt: request.deletedAt?.toISOString() ?? null,
      headersCount: request._count?.headers ?? request.headers?.length ?? 0,
      hasBody: request.bodyType !== 'NONE',
    };
  }

  private normalizeRunRequestHeaders(
    headersInput?: RunHeaderInput[],
  ): RunHeaderRow[] {
    return (
      headersInput
        ?.filter((header) => header.enabled !== false)
        .filter((header) => header.key.trim().length > 0)
        .map((header) => ({
          key: header.key.trim(),
          value: header.value ?? '',
        })) ?? []
    );
  }

  private buildFetchHeaders(headersInput?: RunHeaderInput[]) {
    const headers = new Headers();

    this.normalizeRunRequestHeaders(headersInput).forEach((header) => {
      headers.set(header.key, header.value);
    });

    return headers;
  }

  private shouldSendBody(method: HttpMethod, bodyType: RequestBodyType) {
    if (
      method === HttpMethod.GET ||
      method === HttpMethod.HEAD ||
      method === HttpMethod.DELETE
    ) {
      return false;
    }

    return bodyType !== RequestBodyType.NONE;
  }

  private getResponseHeaderRows(responseHeaders: Headers): RunHeaderRow[] {
    const headersWithGetSetCookie = responseHeaders as Headers & {
      getSetCookie?: () => string[];
    };

    const headerEntries = Array.from(responseHeaders.entries());

    const fallbackSetCookieValues = headerEntries
      .filter(([key]) => key.toLowerCase() === 'set-cookie')
      .map(([, value]) => value);

    const setCookieValues =
      headersWithGetSetCookie.getSetCookie?.() ?? fallbackSetCookieValues;

    const normalHeaderRows = headerEntries
      .filter(([key]) => key.toLowerCase() !== 'set-cookie')
      .map(([key, value]) => ({
        key,
        value,
      }));

    return [
      ...normalHeaderRows,
      ...setCookieValues.map((value) => ({
        key: 'set-cookie',
        value,
      })),
    ];
  }

  private headersToRecord(
    headers: Array<{
      key: string;
      value: string | null;
    }>,
  ) {
    return headers.reduce<Record<string, string | string[]>>(
      (result, header) => {
        const key = header.key;
        const value = header.value ?? '';

        const existingValue = result[key];

        if (existingValue === undefined) {
          result[key] = value;
          return result;
        }

        if (Array.isArray(existingValue)) {
          existingValue.push(value);
          return result;
        }

        result[key] = [existingValue, value];
        return result;
      },
      {},
    );
  }

  private getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Request failed.';
  }

  private serializeRequestRun(run: RequestRunWithHeaders) {
    return {
      id: run.id,
      workspaceId: run.workspaceId,
      requestId: run.requestId,
      userId: run.userId,
      environmentId: run.environmentId,

      method: run.method,
      uri: run.uri,

      status: run.status,
      statusCode: run.statusCode,
      durationMs: run.durationMs,

      requestBody: run.requestBody,
      responseBody: run.responseBody,
      responseSize: run.responseSize,
      errorMessage: run.errorMessage,

      requestHeaders: this.headersToRecord(run.requestHeaders ?? []),
      responseHeaders: this.headersToRecord(run.responseHeaders ?? []),

      createdAt: run.createdAt.toISOString(),
    };
  }

  private toDateKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private async executeRequestRun(params: {
    workspaceId: string;
    requestId: string | null;
    userId: string | undefined;
    environmentId?: string | null;

    method: HttpMethod;
    uri: string;

    bodyType: RequestBodyType;
    rawBody: string | null;

    headers?: RunHeaderInput[];
  }) {
    const {
      workspaceId,
      requestId,
      userId,
      method,
      uri,
      bodyType,
      rawBody,
      headers: headersInput,
    } = params;

    const startedAt = Date.now();

    const requestHeaderRows = this.normalizeRunRequestHeaders(headersInput);
    const fetchHeaders = this.buildFetchHeaders(headersInput);
    const shouldSendBody = this.shouldSendBody(method, bodyType);
    const requestBody = shouldSendBody ? (rawBody ?? '') : null;

    try {
      const response = await fetch(uri, {
        method,
        headers: fetchHeaders,
        body: requestBody ?? undefined,
      });

      const responseBody = await response.text();
      const durationMs = Date.now() - startedAt;
      const responseSize = Buffer.byteLength(responseBody, 'utf8');
      const responseHeaderRows = this.getResponseHeaderRows(response.headers);

      const run = await this.prisma.requestRun.create({
        data: {
          workspaceId,
          requestId,
          userId: userId ?? null,
          environmentId: params.environmentId ?? null,

          method,
          uri,

          status: response.ok
            ? RequestRunStatus.SUCCESS
            : RequestRunStatus.FAILED,

          statusCode: response.status,
          durationMs,

          requestBody,
          responseBody,
          responseSize,

          errorMessage: response.ok ? null : response.statusText,

          requestHeaders: {
            create: requestHeaderRows,
          },

          responseHeaders: {
            create: responseHeaderRows,
          },
        },
        include: {
          requestHeaders: true,
          responseHeaders: true,
        },
      });

      return this.serializeRequestRun(run);
    } catch (caughtError: unknown) {
      const durationMs = Date.now() - startedAt;
      const errorMessage = this.getErrorMessage(caughtError);

      const run = await this.prisma.requestRun.create({
        data: {
          workspaceId,
          requestId,
          userId: userId ?? null,
          environmentId: params.environmentId ?? null,

          method,
          uri,

          status: RequestRunStatus.FAILED,

          statusCode: null,
          durationMs,

          requestBody,
          responseBody: null,
          responseSize: null,

          errorMessage,

          requestHeaders: {
            create: requestHeaderRows,
          },
        },
        include: {
          requestHeaders: true,
          responseHeaders: true,
        },
      });

      return this.serializeRequestRun(run);
    }
  }

  private async callGenerateTestCasesModel(
    payload: GenerateTestCasesModelPayload,
  ): Promise<GenerateTestCasesModelResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch(appConfig.testCaseGenerator.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new AppException({
          code: 'GENERATE_TEST_CASES_FAILED',
          message: 'Failed to generate test cases.',
          status: 502,
          hint: `Model server returned ${response.status}: ${responseText.slice(
            0,
            500,
          )}`,
          docs: '',
        });
      }

      try {
        return JSON.parse(responseText) as GenerateTestCasesModelResponse;
      } catch {
        throw new AppException({
          code: 'INVALID_GENERATE_TEST_CASES_RESPONSE',
          message: 'Invalid generate test cases response.',
          status: 502,
          hint: `Model server did not return valid JSON: ${responseText.slice(
            0,
            500,
          )}`,
          docs: '',
        });
      }
    } catch (error: unknown) {
      if (error instanceof AppException) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppException({
          code: 'GENERATE_TEST_CASES_TIMEOUT',
          message: 'Generate test cases request timed out.',
          status: 504,
          hint: 'The AI model took too long to respond.',
          docs: '',
        });
      }

      throw new AppException({
        code: 'GENERATE_TEST_CASES_MODEL_UNREACHABLE',
        message: 'Could not connect to test case generation model.',
        status: 502,
        hint:
          error instanceof Error
            ? error.message
            : 'Model server is unreachable.',
        docs: '',
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private normalizeGeneratedTestCases(
    modelResponse: GenerateTestCasesModelResponse,
  ): GeneratedTestCase[] {
    const generatedTestCases = modelResponse.generatedTestCases;

    if (!Array.isArray(generatedTestCases)) {
      return [];
    }

    return generatedTestCases.map((testCase, index) => {
      const name =
        typeof testCase.name === 'string' && testCase.name.trim()
          ? testCase.name.trim()
          : `Test case ${index + 1}`;

      const expectedStatus =
        typeof testCase.expectedStatus === 'number'
          ? testCase.expectedStatus
          : 200;

      const isPositiveCase =
        typeof testCase.isPositiveCase === 'boolean'
          ? testCase.isPositiveCase
          : expectedStatus >= 200 && expectedStatus < 300;

      return {
        name,
        expectedStatus,
        body: testCase.body ?? null,
        isPositiveCase,
      };
    });
  }

  private parseTestCaseBody(moddedBody: string) {
    try {
      return JSON.parse(moddedBody) as unknown;
    } catch {
      return moddedBody;
    }
  }

  private serializeRequestTestCase(testCase: {
    id: string;
    requestId: string;
    name: string;
    description: string | null;
    expectedStatus: number;
    isPositiveCase: boolean;
    moddedBody: string;
  }): SavedRequestTestCase {
    return {
      id: testCase.id,
      requestId: testCase.requestId,
      name: testCase.name,
      description: testCase.description,
      expectedStatus: testCase.expectedStatus,
      body: this.parseTestCaseBody(testCase.moddedBody),
      isPositiveCase: testCase.isPositiveCase,
      enabled: true,
    };
  }

  private stringifyTestCaseBody(body: unknown) {
    if (typeof body === 'string') {
      return body;
    }

    return JSON.stringify(body ?? null, null, 2);
  }
}
