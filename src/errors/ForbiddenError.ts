import HttpStatus from './HttpStatus';

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message = 'Доступ запрещён') {
    super(message);
    this.statusCode = HttpStatus.Forbidden;
  }
}
