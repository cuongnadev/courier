import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { WorkspacesService } from '../workspaces';

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

    return this.prisma.collection.create({
      data: {
        workspaceId,
        name: dto.name,
        description: dto.description,
        sortOrder: dto.sortOrder,
      },
    });
  }

  async findAll(workspaceId: string, userId?: string, limit?: number) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    return this.prisma.collection.findMany({
      where: {
        workspaceId,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      take: limit,
    });
  }

  async findOne(collectionId: string, workspaceId: string, userId?: string) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    const collection = await this.prisma.collection.findFirst({
      where: {
        id: collectionId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }

  async update(
    collectionId: string,
    workspaceId: string,
    userId: string | undefined,
    dto: UpdateCollectionDto,
  ) {
    await this.findOne(collectionId, workspaceId, userId);

    return this.prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: dto,
    });
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

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.collection.count({
      where: {
        workspaceId,
        deletedAt: null,
      },
    });
  }

  async assertWorkspaceAccess(
    workspaceId: string,
    userId?: string,
  ): Promise<void> {
    await this.workspaceService.assertAccess(workspaceId, userId);
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
      throw new NotFoundException('Collection not found');
    }
  }
}
