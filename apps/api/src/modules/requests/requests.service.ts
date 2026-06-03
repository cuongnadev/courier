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

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspacesService,
    private readonly collectionsService: CollectionsService,
  ) {}

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

    await this.prisma.apiRequest.update({
      where: {
        id: requestId,
      },
      data: dto,
    });

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

  async assertWorkspaceAccess(
    workspaceId: string,
    userId?: string,
  ): Promise<void> {
    await this.workspaceService.assertAccess(workspaceId, userId);
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
}
