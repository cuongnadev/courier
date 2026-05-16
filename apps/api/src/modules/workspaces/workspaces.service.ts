import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        deletedAt: null,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(workspaceId: string, userId?: string) {
    await this.assertAccess(workspaceId, userId);

    return this.prisma.workspace.findFirstOrThrow({
      where: {
        id: workspaceId,
        deletedAt: null,
      },
    });
  }

  async update(
    workspaceId: string,
    userId: string | undefined,
    dto: UpdateWorkspaceDto,
  ) {
    await this.assertAccess(workspaceId, userId);

    return this.prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: dto,
    });
  }

  async remove(workspaceId: string, userId?: string) {
    await this.assertAccess(workspaceId, userId);

    return this.prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async countTeamMembers(workspaceId: string): Promise<number> {
    return this.prisma.workspaceMember.count({
      where: {
        workspaceId,
      },
    });
  }

  async assertAccess(workspaceId: string, userId?: string): Promise<void> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        deletedAt: null,
      },
      select: {
        ownerId: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (!userId || workspace.ownerId === userId) {
      return;
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this workspace');
    }
  }

  async assertExists(workspaceId: string): Promise<void> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }
  }
}
