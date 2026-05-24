import { IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#EC4899'])
  color?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
