import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@/utils/errors';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new UnauthorizedError(
          'You do not have permission to perform this action',
        ),
      );
    }

    next();
  };
};
