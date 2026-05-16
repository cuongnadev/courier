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

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}
