export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};