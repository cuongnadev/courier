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
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('workspaces/:workspaceId/collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Version('1')
  @Post()
  create(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Body() createCollectionDto: CreateCollectionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.collectionsService.create(
      workspaceId,
      request.user.sub,
      createCollectionDto,
    );
  }

  @Version('1')
  @Get()
  findAll(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.collectionsService.findAll(workspaceId, request.user.sub);
  }

  @Version('1')
  @Get('count')
  async count(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    await this.collectionsService.assertWorkspaceAccess(
      workspaceId,
      request.user.sub,
    );
    const count = await this.collectionsService.countByWorkspace(workspaceId);

    return { count };
  }

  @Version('1')
  @Get(':collectionId')
  findOne(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.collectionsService.findOne(
      collectionId,
      workspaceId,
      request.user.sub,
    );
  }

  @Version('1')
  @Patch(':collectionId')
  update(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.collectionsService.update(
      collectionId,
      workspaceId,
      request.user.sub,
      updateCollectionDto,
    );
  }

  @Version('1')
  @Delete(':collectionId')
  remove(
    @Param('workspaceId', new ParseUUIDPipe()) workspaceId: string,
    @Param('collectionId', new ParseUUIDPipe()) collectionId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.collectionsService.remove(
      collectionId,
      workspaceId,
      request.user.sub,
    );
  }
}
