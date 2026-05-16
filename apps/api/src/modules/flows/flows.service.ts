import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { WorkspacesService } from '../workspaces';

@Injectable()
export class FlowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workspaceService: WorkspacesService,
  ) {}

  async create(
    workspaceId: string,
    userId: string | undefined,
    dto: CreateFlowDto,
  ) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    return this.prisma.flow.create({
      data: {
        workspaceId,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        sortOrder: dto.sortOrder,
      },
    });
  }

  async findAll(workspaceId: string, userId?: string, active?: boolean) {
    await this.assertWorkspaceAccess(workspaceId, userId);

    return this.prisma.flow.findMany({
      where: {
        workspaceId,
        deletedAt: null,
        ...(active ? { status: { not: 'ARCHIVED' } } : {}),
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findOne(flowId: string, workspaceId: string, userId?: string) {
    await this.workspaceService.assertAccess(workspaceId, userId);

    const flow = await this.prisma.flow.findFirst({
      where: {
        id: flowId,
        workspaceId,
        deletedAt: null,
      },
    });

    if (!flow) {
      throw new NotFoundException('Flow not found');
    }

    return flow;
  }

  async update(
    flowId: string,
    workspaceId: string,
    userId: string | undefined,
    dto: UpdateFlowDto,
  ) {
    await this.findOne(flowId, workspaceId, userId);

    return this.prisma.flow.update({
      where: {
        id: flowId,
      },
      data: dto,
    });
  }

  async remove(flowId: string, workspaceId: string, userId?: string) {
    await this.findOne(flowId, workspaceId, userId);

    return this.prisma.flow.update({
      where: {
        id: flowId,
      },
      data: {
        status: 'ARCHIVED',
        deletedAt: new Date(),
      },
    });
  }

  async countActiveByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.flow.count({
      where: {
        workspaceId,
        status: {
          not: 'ARCHIVED',
        },
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
}
