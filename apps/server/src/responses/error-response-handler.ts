import { ClientError } from '../models/errors';

const getClientErrorResponse = (error: ClientError) => {
  if (error.payload) {
    return { message: error.message, errors: error.payload };
  }

  return { message: error.message };
};

const getServerErrorResponse = (error: Error) => {
  return { message: error.message, stack: error.stack };
};

export default {
  getClientErrorResponse,
  getServerErrorResponse,
};
