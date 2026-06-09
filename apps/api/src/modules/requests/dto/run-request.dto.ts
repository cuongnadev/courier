import {
  IsArray,
  IsBoolean,
  IsIn,
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
} from '@/generated/prisma/enums';

import type {
  HttpMethod as HttpMethodType,
  RawBodyLanguage as RawBodyLanguageType,
  RequestBodyType as RequestBodyTypeType,
} from '@/generated/prisma/enums';

export class RunRequestHeaderDto {
  @IsString()
  @MinLength(1)
  key!: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class RunRequestDto {
  @IsIn(Object.values(HttpMethod))
  method!: HttpMethodType;

  @IsString()
  @MinLength(1)
  uri!: string;

  @IsIn(Object.values(RequestBodyType))
  bodyType!: RequestBodyTypeType;

  @IsIn(Object.values(RawBodyLanguage))
  rawBodyLanguage!: RawBodyLanguageType;

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RunRequestHeaderDto)
  headers?: RunRequestHeaderDto[];
}
