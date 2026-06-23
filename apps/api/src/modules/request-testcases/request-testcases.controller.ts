import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  Version,
} from '@nestjs/common';

import {
  CreateRequestTestcaseDto,
  UpdateRequestTestcaseDto,
} from '@/modules/request-testcases/dto';

import { RequestTestcasesService } from '@/modules/request-testcases/request-testcases.service';

import { AuthGuard } from '@/common/guards';
import type { AuthenticatedRequest } from '@/common/types';

@Controller('workspaces/:workspaceId/requests/:requestId/testcases')
@UseGuards(AuthGuard)
export class RequestTestcasesController {
  constructor(
    private readonly requestTestcasesService: RequestTestcasesService,
  ) {}

  @Version('1')
  @Post()
  createMany(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Body(
      new ParseArrayPipe({ items: CreateRequestTestcaseDto, whitelist: true }),
    )
    createRequestTestcaseDtos: CreateRequestTestcaseDto[],
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.createMany(
      workspaceId,
      requestId,
      request.user.sub,
      createRequestTestcaseDtos,
    );
  }

  @Version('1')
  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.findAll(
      workspaceId,
      requestId,
      request.user.sub,
    );
  }

  @Version('1')
  @Get('with-relations')
  findAllWithRelations(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.findAllWithRelations(
      workspaceId,
      requestId,
      request.user.sub,
    );
  }

  @Version('1')
  @Get(':testcaseId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Param('testcaseId', new ParseUUIDPipe()) testcaseId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.findOne(
      testcaseId,
      workspaceId,
      requestId,
      request.user.sub,
    );
  }

  @Version('1')
  @Get(':testcaseId/with-relations')
  findOneWithRelations(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Param('testcaseId', new ParseUUIDPipe()) testcaseId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.findOneWithRelations(
      testcaseId,
      workspaceId,
      requestId,
      request.user.sub,
    );
  }

  @Version('1')
  @Patch(':testcaseId')
  update(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Param('testcaseId', new ParseUUIDPipe()) testcaseId: string,
    @Body() updateRequestTestcaseDto: UpdateRequestTestcaseDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.update(
      testcaseId,
      workspaceId,
      requestId,
      request.user.sub,
      updateRequestTestcaseDto,
    );
  }

  @Version('1')
  @Delete(':testcaseId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Param('testcaseId', new ParseUUIDPipe()) testcaseId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestTestcasesService.remove(
      testcaseId,
      workspaceId,
      requestId,
      request.user.sub,
    );
  }
}
