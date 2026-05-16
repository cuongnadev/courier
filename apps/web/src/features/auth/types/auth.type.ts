export interface User {
    id: string;
    email: string;
    fullName: string;
    photoUrl: string;
}

export type ErrorResponse = {
  message: string;
};