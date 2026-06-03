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

class CreateAndRunRequestHeaderDto {
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

export class CreateAndRunRequestDto {
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
  @Type(() => CreateAndRunRequestHeaderDto)
  headers?: CreateAndRunRequestHeaderDto[];
}
