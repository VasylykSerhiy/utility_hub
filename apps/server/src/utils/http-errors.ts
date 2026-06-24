import ClientError from '../models/errors/client-error.model';

export { ClientError };

export function badRequest(message: string, payload: object | null = null): never {
  throw new ClientError(message, 400, payload);
}

export function unauthorized(message = 'Unauthorized'): never {
  throw new ClientError(message, 401);
}

export function forbidden(message = 'Forbidden'): never {
  throw new ClientError(message, 403);
}

export function notFound(message = 'Not found'): never {
  throw new ClientError(message, 404);
}

export function conflict(message: string): never {
  throw new ClientError(message, 409);
}

export function serverError(message: string, cause?: unknown): never {
  if (cause !== undefined) {
    console.error(message, cause);
  }
  throw new ClientError(message, 500);
}

export function assertFound<T>(
  value: T | null | undefined,
  message = 'Not found',
): asserts value is T {
  if (value == null) {
    notFound(message);
  }
}
