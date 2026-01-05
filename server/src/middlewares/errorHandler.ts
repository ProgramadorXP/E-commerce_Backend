import { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/errors';
import logger from '@/utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If it's an AppError (our custom errors)
  if (err instanceof AppError) {
    logger.warn(`${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({ message: err.message });
  }

  // If it's an unknown error (DB, syntax, etc.)
  logger.error('Unexpected error: ', err);
  return res.status(500).json({ error: 'Internal server error' });
};
