import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GenerateTestCasesDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  prompt?: string;
}
