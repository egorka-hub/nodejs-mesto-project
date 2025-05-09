import { Request, Response } from 'express';
import HttpStatus from './HttpStatus';

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
) {
  const { statusCode = HttpStatus.InternalServerError, message } = err as {
    statusCode?: number;
    message?: string;
  };

  res.status(statusCode).send({
    message:
      statusCode === HttpStatus.InternalServerError
        ? 'На сервере произошла ошибка'
        : message,
  });
}
