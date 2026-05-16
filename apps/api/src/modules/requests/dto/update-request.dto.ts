import { IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
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
