import { Response, Request, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If it's an AppError (our custom errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // If it's an unknown error (DB, sintaxis, etc.)
  console.error('Unexpected error: ', err);
  return res.status(500).json({ error: 'Internal server error' });
};
