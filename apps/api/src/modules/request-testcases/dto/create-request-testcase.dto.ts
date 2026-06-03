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

export class CreateRequestTestcaseDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(100)
  @Max(599)
  expectedStatus!: number;

  @IsBoolean()
  isPositiveCase!: boolean;

  @IsString()
  @IsJSON()
  moddedBody!: string;
}
