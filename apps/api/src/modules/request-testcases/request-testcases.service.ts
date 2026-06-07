import { Injectable } from '@nestjs/common';
import { AppException } from '@/common/exceptions/app.exceptions';
import { PrismaService } from '../../database/prisma.service';
import { RequestsService } from '../requests';
import { CreateRequestTestcaseDto } from './dto/create-request-testcase.dto';
import { UpdateRequestTestcaseDto } from './dto/update-request-testcase.dto';
import { ERROR_CODES } from '@/common/constants';

@Injectable()
export class RequestTestcasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestsService: RequestsService,
  ) {}

  async createMany(
    workspaceId: string,
    requestId: string,
    userId: string | undefined,
    dtos: CreateRequestTestcaseDto[],
  ) {
    await this.requestsService.findOne(requestId, workspaceId, userId);

    if (dtos.length === 0) {
      return { count: 0 };
    }

    const result = await this.prisma.requestTestcase.createMany({
      data: dtos.map((dto) => ({
        requestId,
        name: dto.name,
        description: dto.description,
        expectedStatus: dto.expectedStatus,
        isPositiveCase: dto.isPositiveCase,
        moddedBody: dto.moddedBody,
      })),
    });

    return { count: result.count };
  }

  async findAll(workspaceId: string, requestId: string, userId?: string) {
    await this.requestsService.findOne(requestId, workspaceId, userId);

    return this.prisma.requestTestcase.findMany({
      where: {
        requestId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAllWithRelations(
    workspaceId: string,
    requestId: string,
    userId?: string,
  ) {
    await this.requestsService.findOne(requestId, workspaceId, userId);

    return this.prisma.requestTestcase.findMany({
      where: {
        requestId,
      },
      include: this.testcaseRelationsInclude(),
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(
    testcaseId: string,
    workspaceId: string,
    requestId: string,
    userId?: string,
  ) {
    await this.requestsService.findOne(requestId, workspaceId, userId);

    const testcase = await this.prisma.requestTestcase.findFirst({
      where: {
        id: testcaseId,
        requestId,
      },
    });

    if (!testcase) {
      throw this.notFound();
    }

    return testcase;
  }

  async findOneWithRelations(
    testcaseId: string,
    workspaceId: string,
    requestId: string,
    userId?: string,
  ) {
    await this.requestsService.findOne(requestId, workspaceId, userId);

    const testcase = await this.prisma.requestTestcase.findFirst({
      where: {
        id: testcaseId,
        requestId,
      },
      include: this.testcaseRelationsInclude(),
    });

    if (!testcase) {
      throw this.notFound();
    }

    return testcase;
  }

  async update(
    testcaseId: string,
    workspaceId: string,
    requestId: string,
    userId: string | undefined,
    dto: UpdateRequestTestcaseDto,
  ) {
    await this.findOne(testcaseId, workspaceId, requestId, userId);

    return this.prisma.requestTestcase.update({
      where: {
        id: testcaseId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        expectedStatus: dto.expectedStatus,
        isPositiveCase: dto.isPositiveCase,
        moddedBody: dto.moddedBody,
      },
    });
  }

  async remove(
    testcaseId: string,
    workspaceId: string,
    requestId: string,
    userId?: string,
  ) {
    await this.findOne(testcaseId, workspaceId, requestId, userId);

    return this.prisma.requestTestcase.delete({
      where: {
        id: testcaseId,
      },
    });
  }

  private testcaseRelationsInclude() {
    return {
      request: {
        select: {
          id: true,
          collectionId: true,
          name: true,
          method: true,
          uri: true,
          bodyType: true,
          rawBodyLanguage: true,
          rawBody: true,
          graphqlQuery: true,
          graphqlVariables: true,
          description: true,
          sortOrder: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          collection: {
            select: {
              id: true,
              name: true,
              workspaceId: true,
            },
          },
        },
      },
    };
  }

  private notFound() {
    return new AppException({
      code: ERROR_CODES.REQUEST_TESTCASE_NOT_FOUND,
      message: 'Request testcase not found.',
      status: 404,
      hint: 'The requested testcase does not exist for this request.',
      docs: '',
    });
  }
}
