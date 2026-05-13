export interface User {
    id: string;
    email: string;
    fullName: string;
}

export type ErrorResponse = {
  message: string;
};