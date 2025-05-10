import HttpStatus from './HttpStatus';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Необходима авторизация') {
    super(message);
    this.statusCode = HttpStatus.Unauthorized;
  }
}
