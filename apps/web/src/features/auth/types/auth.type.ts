export interface User {
    id: string;
    email: string;
    fullName: string;
    photoUrl: string;
}

export type ErrorResponse = {
  message: string;
};

export type AuthStore = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};
