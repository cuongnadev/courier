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

export class ImportRequestHeaderDto {
  @IsString()
  @MinLength(1)
  key!: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class ImportRequestDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsIn(Object.values(HttpMethod))
  method?: HttpMethodType;

  @IsString()
  @MinLength(1)
  uri!: string;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportRequestHeaderDto)
  headers?: ImportRequestHeaderDto[];
}

export class ImportCollectionDto {
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportRequestDto)
  requests?: ImportRequestDto[];
}
