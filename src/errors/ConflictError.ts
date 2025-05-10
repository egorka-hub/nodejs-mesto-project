import HttpStatus from './HttpStatus';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message = 'Конфликт данных') {
    super(message);
    this.statusCode = HttpStatus.Conflict;
  }
}
