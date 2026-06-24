export default class ClientError extends Error {
  constructor(
    message: string,
    public status = 400,
    public payload: object | null = null,
  ) {
    super(message);
    this.name = 'ClientError';
  }
}
