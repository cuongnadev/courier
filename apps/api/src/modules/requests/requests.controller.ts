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
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RunRequestDto } from './dto/run-request.dto';
import { CreateAndRunRequestDto } from './dto/create-and-run-request.dto';
import { RequestsService } from './requests.service';
import { GenerateTestCasesDto } from './dto/generate-test-cases.dto';

@Controller('workspaces/:workspaceId')
@UseGuards(AuthGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Version('1')
  @Post('collections/:collectionId/requests')
  create(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Body() createRequestDto: CreateRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.create(
      workspaceId,
      collectionId,
      request.user.sub,
      createRequestDto,
    );
  }

  @Version('1')
  @Get('collections/:collectionId/requests')
  findAllByCollection(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.findAllByCollection(
      workspaceId,
      collectionId,
      request.user.sub,
    );
  }

  @Version('1')
  @Get('collections/:collectionId/requests/:requestId')
  findOneByCollection(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.findOneByCollection(
      workspaceId,
      collectionId,
      requestId,
      request.user.sub,
    );
  }

  @Version('1')
  @Post('collections/:collectionId/requests/:requestId/run')
  run(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Body() dto: RunRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.run(
      workspaceId,
      collectionId,
      requestId,
      request.user.sub,
      dto,
    );
  }

  @Version('1')
  @Post('collections/:collectionId/requests/run')
  createAndRun(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Body() dto: CreateAndRunRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.createAndRun(
      workspaceId,
      collectionId,
      request.user.sub,
      dto,
    );
  }

  @Version('1')
  @Get('requests')
  findAllByWorkspace(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.findAllByWorkspace(
      workspaceId,
      request.user.sub,
    );
  }

  @Version('1')
  @Get('requests/count')
  async countByWorkspace(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.requestsService.assertWorkspaceAccess(
      workspaceId,
      request.user.sub,
    );
    const count = await this.requestsService.countByWorkspace(workspaceId);

    return { count };
  }

  @Version('1')
  @Get('requests/runs/count')
  async countRunsByWorkspace(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.requestsService.assertWorkspaceAccess(
      workspaceId,
      request.user.sub,
    );
    const count = await this.requestsService.countRunsByWorkspace(workspaceId);

    return { count };
  }

  @Version('1')
  @Get('requests/runs/success-today/count')
  async countSuccessfulRunsToday(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.requestsService.assertWorkspaceAccess(
      workspaceId,
      request.user.sub,
    );
    const count =
      await this.requestsService.countSuccessfulRunsToday(workspaceId);

    return { count };
  }

  @Version('1')
  @Get('requests/:requestId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.findOne(
      requestId,
      workspaceId,
      request.user.sub,
    );
  }

  @Version('1')
  @Patch('requests/:requestId')
  update(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.update(
      requestId,
      workspaceId,
      request.user.sub,
      updateRequestDto,
    );
  }

  @Version('1')
  @Delete('requests/:requestId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.remove(
      requestId,
      workspaceId,
      request.user.sub,
    );
  }

  @Version('1')
  @Post('collections/:collectionId/requests/:requestId/generate-tests')
  generateTestCases(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Body() dto: GenerateTestCasesDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.generateTestCases(
      workspaceId,
      collectionId,
      requestId,
      request.user.sub,
      dto,
    );
  }

  @Version('1')
  @Get('collections/:collectionId/requests/:requestId/testcases')
  findTestCases(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.findTestCases(
      workspaceId,
      collectionId,
      requestId,
      request.user.sub,
    );
  }

  @Version('1')
  @Delete('collections/:collectionId/requests/:requestId/testcases/:testCaseId')
  deleteTestCase(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Param('requestId', new ParseUUIDPipe()) requestId: string,
    @Param('testCaseId', new ParseUUIDPipe()) testCaseId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.requestsService.deleteTestCase(
      workspaceId,
      collectionId,
      requestId,
      testCaseId,
      request.user.sub,
    );
  }
}
