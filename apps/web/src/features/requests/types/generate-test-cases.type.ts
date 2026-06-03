export type GeneratedTestCase = {
  id: string;
  requestId: string;
  name: string;
  description: string | null;
  expectedStatus: number;
  body: unknown;
  isPositiveCase: boolean;

  /**
   * Local UI only.
   * Backend không cần lưu enabled.
   */
  enabled?: boolean;
};

export type GenerateTestCasesPayload = {
  prompt?: string;
};

export type GenerateTestCasesResponse = {
  testCases: GeneratedTestCase[];
  testCasesCount: number;
};

export type ListTestCasesResponse = {
  testCases: GeneratedTestCase[];
  testCasesCount: number;
};

export type DeleteTestCaseResponse = {
  deleted: boolean;
  id: string;
};