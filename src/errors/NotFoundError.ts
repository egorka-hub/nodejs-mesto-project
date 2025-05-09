import HttpStatus from './HttpStatus';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message = 'Запрашиваемый ресурс не найден') {
    super(message);
    this.statusCode = HttpStatus.NotFound;
  }
}
