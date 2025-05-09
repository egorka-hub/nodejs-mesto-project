import HttpStatus from './HttpStatus';

export default class BadRequestError extends Error {
  statusCode: number;

  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.statusCode = HttpStatus.BadRequest;
  }
}
