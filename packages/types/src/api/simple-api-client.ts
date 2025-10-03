export type GetTest = () => Promise<GetTestResponse>;

export interface GetTestResponse {
  message: string;
}

export interface SimpleApiClient {
  getTest: GetTest;
}
