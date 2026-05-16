import { AuthTokens } from '../../../common/types/authenticated-request.type';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  photoUrl: string;
  age: number | null;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AuthResponse = {
  user: AuthUser;
} & AuthTokens;
