import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      return res.status(400).json({
        error: result.error.issues.map((issue) => ({
          path: issue.path[1],
          message: issue.message,
          code: issue.code,
        })),
      });
    }
    next();
  };
}
