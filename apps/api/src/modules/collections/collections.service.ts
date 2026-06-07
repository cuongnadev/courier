import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { WorkspacesService } from '../workspaces';
import { AppException } from '@/common/exceptions/app.exceptions';
import { ImportCollectionDto } from './dto/import-collection.dto';

import {
  HttpMethod,
  RawBodyLanguage,
  RequestBodyType,
} from '@/generated/prisma/enums';

import type {
  HttpMethod as HttpMethodType,
  RawBodyLanguage as RawBodyLanguageType,
  RequestBodyType as RequestBodyTypeType,
} from '@/generated/prisma/enums';
import { ERROR_CODES } from '@/common/constants';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspacesService,
  ) {}

  async create(
    workspaceId: string,
    userId: string | undefined,
    dto: CreateCollectionDto,
  ) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    await this.assertNameAvailable(workspaceId, dto.name);

    const sortOrder =
      dto.sortOrder ?? (await this.getNextSortOrder(workspaceId));

    const collection = await this.prisma.collection.create({
      data: {
        workspaceId,
        name: dto.name,
        description: dto.description,
        color: dto.color,
        sortOrder,
      },
    });

    return this.findOne(collection.id, workspaceId, userId);
  }

  async importCollection(
    workspaceId: string,
    userId: string | undefined,
    dto: ImportCollectionDto,
  ) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    await this.assertNameAvailable(workspaceId, dto.name);

    const importedCollection = await this.prisma.$transaction(async (tx) => {
      const sortOrder =
        dto.sortOrder ?? (await this.getNextSortOrder(workspaceId));

      const collection = await tx.collection.create({
        data: {
          workspaceId,
          name: dto.name,
          description: dto.description ?? null,
          color: dto.color ?? '#F59E0B',
          sortOrder,
        },
      });

      const requests = dto.requests ?? [];

      for (const [index, request] of requests.entries()) {
        const method: HttpMethodType = request.method ?? HttpMethod.GET;

        const bodyType: RequestBodyTypeType =
          request.bodyType ?? RequestBodyType.NONE;

        const rawBodyLanguage: RawBodyLanguageType =
          request.rawBodyLanguage ?? RawBodyLanguage.JSON;

        const createdRequest = await tx.apiRequest.create({
          data: {
            collectionId: collection.id,

            name: request.name,
            method,
            uri: request.uri,

            bodyType,
            rawBodyLanguage,

            rawBody: request.rawBody ?? null,
            graphqlQuery: request.graphqlQuery ?? null,
            graphqlVariables: request.graphqlVariables ?? null,

            description: request.description ?? null,
            sortOrder: request.sortOrder ?? index,
          },
        });

        const headers = request.headers ?? [];

        if (headers.length > 0) {
          await tx.requestHeader.createMany({
            data: headers.map((header, headerIndex) => ({
              requestId: createdRequest.id,
              key: header.key,
              value: header.value ?? null,
              enabled: header.enabled ?? true,
              sortOrder: header.sortOrder ?? headerIndex,
            })),
          });
        }
      }

      return tx.collection.findUniqueOrThrow({
        where: {
          id: collection.id,
        },
        include: this.collectionWithRequestsInclude(),
      });
    });

    return this.toCollectionResponse(importedCollection);
  }

  async findAll(workspaceId: string, userId?: string, limit?: number) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    const collections = await this.prisma.collection.findMany({
      where: {
        workspaceId,
        deletedAt: null,
      },
      include: this.collectionWithRequestsInclude(),
      orderBy: {
        sortOrder: 'asc',
      },
      take: limit,
    });

    return collections.map((collection) =>
      this.toCollectionResponse(collection),
    );
  }

  async findOne(collectionId: string, workspaceId: string, userId?: string) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    const collection = await this.prisma.collection.findFirst({
      where: {
        id: collectionId,
        workspaceId,
        deletedAt: null,
      },
      include: this.collectionWithRequestsInclude(),
    });

    if (!collection) {
      throw new AppException({
        code: ERROR_CODES.COLLECTION_NOT_FOUND,
        message: 'Collection not found.',
        status: 404,
        hint: 'The requested collection does not exist or has been deleted.',
        docs: '',
      });
    }

    return this.toCollectionResponse(collection);
  }

  async update(
    collectionId: string,
    workspaceId: string,
    userId: string | undefined,
    dto: UpdateCollectionDto,
  ) {
    const currentCollection = await this.findOne(
      collectionId,
      workspaceId,
      userId,
    );

    if (dto.name && dto.name !== currentCollection.name) {
      await this.assertNameAvailable(workspaceId, dto.name, collectionId);
    }

    await this.prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        color: dto.color,
        sortOrder: dto.sortOrder,
      },
    });

    return this.findOne(collectionId, workspaceId, userId);
  }

  async remove(collectionId: string, workspaceId: string, userId?: string) {
    await this.findOne(collectionId, workspaceId, userId);

    return this.prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async countByWorkspace(
    workspaceId: string,
    userId?: string,
  ): Promise<number> {
    await this.workspaceService.assertAccess(workspaceId, userId);

    return this.prisma.collection.count({
      where: {
        workspaceId,
        deletedAt: null,
      },
    });
  }

  async assertInWorkspace(
    collectionId: string,
    workspaceId: string,
  ): Promise<void> {
    const collection = await this.prisma.collection.findFirst({
      where: {
        id: collectionId,
        workspaceId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!collection) {
      throw new AppException({
        code: ERROR_CODES.COLLECTION_NOT_FOUND,
        message: 'Collection not found.',
        status: 404,
        hint: 'The collection does not exist in this workspace.',
        docs: '',
      });
    }
  }

  private async assertNameAvailable(
    workspaceId: string,
    name: string,
    excludeCollectionId?: string,
  ) {
    const collection = await this.prisma.collection.findFirst({
      where: {
        workspaceId,
        name,
        deletedAt: null,
        id: excludeCollectionId
          ? {
              not: excludeCollectionId,
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });

    if (collection) {
      throw new AppException({
        code: ERROR_CODES.COLLECTION_NAME_EXISTS,
        message: 'Collection name already exists.',
        status: 409,
        hint: 'Use a different collection name in this workspace.',
        docs: '',
      });
    }
  }

  private async getNextSortOrder(workspaceId: string) {
    const lastCollection = await this.prisma.collection.findFirst({
      where: {
        workspaceId,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'desc',
      },
      select: {
        sortOrder: true,
      },
    });

    return (lastCollection?.sortOrder ?? -1) + 1;
  }

  private collectionWithRequestsInclude = () => ({
    requests: {
      where: {
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc' as const,
      },
      include: {
        headers: {
          orderBy: {
            sortOrder: 'asc' as const,
          },
        },
        _count: {
          select: {
            headers: true,
          },
        },
      },
    },
    _count: {
      select: {
        requests: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
  });

  private toCollectionResponse<
    T extends {
      createdAt: Date;
      updatedAt: Date;
      deletedAt: Date | null;
      requests: Array<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        bodyType: string;
        headers: Array<{
          id: string;
          requestId: string;
          key: string;
          value: string | null;
          enabled: boolean;
          sortOrder: number;
        }>;
        _count: {
          headers: number;
        };
      }>;
      _count: {
        requests: number;
      };
    },
  >(collection: T) {
    const { _count, requests, ...data } = collection;

    return {
      ...data,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      deletedAt: data.deletedAt?.toISOString() ?? null,
      requestsCount: _count.requests,
      requests: requests.map((request) => {
        const { _count: requestCount, headers, ...requestData } = request;

        return {
          ...requestData,
          createdAt: requestData.createdAt.toISOString(),
          updatedAt: requestData.updatedAt.toISOString(),
          deletedAt: requestData.deletedAt?.toISOString() ?? null,
          headersCount: requestCount.headers,
          hasBody: requestData.bodyType !== 'NONE',
          headers: headers.map((header) => ({
            ...header,
            value: header.value ?? '',
          })),
        };
      }),
    };
  }
}
