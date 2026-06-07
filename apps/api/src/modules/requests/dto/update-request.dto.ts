import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  HttpMethod,
  RawBodyLanguage,
  RequestBodyType,
} from '../../../generated/prisma/enums';
import type {
  HttpMethod as HttpMethodType,
  RawBodyLanguage as RawBodyLanguageType,
  RequestBodyType as RequestBodyTypeType,
} from '../../../generated/prisma/enums';

class UpdateRequestHeaderDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsString()
  value?: string | null;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsIn(Object.values(HttpMethod))
  method?: HttpMethodType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  uri?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequestHeaderDto)
  headers?: UpdateRequestHeaderDto[];

  @IsOptional()
  @IsIn(Object.values(RequestBodyType))
  bodyType?: RequestBodyTypeType;

  @IsOptional()
  @IsIn(Object.values(RawBodyLanguage))
  rawBodyLanguage?: RawBodyLanguageType;

  @IsOptional()
  @IsString()
  rawBody?: string;

  @IsOptional()
  @IsString()
  graphqlQuery?: string;

  @IsOptional()
  @IsString()
  graphqlVariables?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
