import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CollectionsService } from '../collections';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { WorkspacesService } from '../workspaces';
import {getTodayRange} from '../../common/utils/date-range.util';

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

    return this.prisma.apiRequest.create({
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
  }

  async findAllByCollection(
    workspaceId: string,
    collectionId: string,
    userId?: string,
  ) {
    await this.workspaceService.assertAccess(workspaceId, userId);
    await this.collectionsService.assertInWorkspace(collectionId, workspaceId);

    return this.prisma.apiRequest.findMany({
      where: {
        collectionId,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findAllByWorkspace(workspaceId: string, userId?: string, limit?: number) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    return this.prisma.apiRequest.findMany({
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
    });
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
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    return request;
  }

  async update(
    requestId: string,
    workspaceId: string,
    userId: string | undefined,
    dto: UpdateRequestDto,
  ) {
    await this.findOne(requestId, workspaceId, userId);

    return this.prisma.apiRequest.update({
      where: {
        id: requestId,
      },
      data: dto,
    });
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
        status: 'SUCCESS',
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
}
