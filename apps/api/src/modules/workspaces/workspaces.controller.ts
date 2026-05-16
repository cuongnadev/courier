import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.type';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(AuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Version('1')
  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.workspacesService.create(request.user.sub, createWorkspaceDto);
  }

  @Version('1')
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.workspacesService.findAll(request.user.sub);
  }

  @Version('1')
  @Get(':workspaceId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.workspacesService.findOne(workspaceId, request.user.sub);
  }

  @Version('1')
  @Patch(':workspaceId')
  update(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.workspacesService.update(
      workspaceId,
      request.user.sub,
      updateWorkspaceDto,
    );
  }

  @Version('1')
  @Delete(':workspaceId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.workspacesService.remove(workspaceId, request.user.sub);
  }

  @Version('1')
  @Get(':workspaceId/team-members/count')
  async countTeamMembers(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.workspacesService.assertAccess(workspaceId, request.user.sub);
    const count = await this.workspacesService.countTeamMembers(workspaceId);

    return { count };
  }
}
