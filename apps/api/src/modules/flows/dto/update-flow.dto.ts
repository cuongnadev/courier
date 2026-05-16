import { IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { FlowStatus } from '../../../generated/prisma/enums';
import type { FlowStatus as FlowStatusType } from '../../../generated/prisma/enums';

export class UpdateFlowDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(Object.values(FlowStatus))
  status?: FlowStatusType;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
