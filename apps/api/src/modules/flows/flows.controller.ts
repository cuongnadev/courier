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
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { FlowsService } from './flows.service';

@Controller('workspaces/:workspaceId/flows')
@UseGuards(AuthGuard)
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Version('1')
  @Post()
  create(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Body() createFlowDto: CreateFlowDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flowsService.create(
      workspaceId,
      request.user.sub,
      createFlowDto,
    );
  }

  @Version('1')
  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flowsService.findAll(workspaceId, request.user.sub);
  }

  @Version('1')
  @Get('active/count')
  async countActive(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.flowsService.assertWorkspaceAccess(
      workspaceId,
      request.user.sub,
    );
    const count = await this.flowsService.countActiveByWorkspace(workspaceId);

    return { count };
  }

  @Version('1')
  @Get(':flowId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('flowId', new ParseUUIDPipe()) flowId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flowsService.findOne(flowId, workspaceId, request.user.sub);
  }

  @Version('1')
  @Patch(':flowId')
  update(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('flowId', new ParseUUIDPipe()) flowId: string,
    @Body() updateFlowDto: UpdateFlowDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flowsService.update(
      flowId,
      workspaceId,
      request.user.sub,
      updateFlowDto,
    );
  }

  @Version('1')
  @Delete(':flowId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('flowId', new ParseUUIDPipe()) flowId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.flowsService.remove(flowId, workspaceId, request.user.sub);
  }
}
