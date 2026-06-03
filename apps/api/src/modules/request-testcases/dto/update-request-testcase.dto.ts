import {
  IsBoolean,
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateRequestTestcaseDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(599)
  expectedStatus?: number;

  @IsOptional()
  @IsBoolean()
  isPositiveCase?: boolean;

  @IsOptional()
  @IsString()
  @IsJSON()
  moddedBody?: string;
}
