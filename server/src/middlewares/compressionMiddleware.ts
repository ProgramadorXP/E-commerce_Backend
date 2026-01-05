import compression from 'compression';
import { Request, Response } from 'express';

/**
 * Middleware to compress responses using Gzip.
 * It will compress any response that is larger than 1kb.
 */
export const compressionMiddleware = compression({
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      // Don't compress responses if this header is present
      return false;
    }
    // Fallback to standard filter function
    return compression.filter(req, res);
  },
  level: 6, // Default compression level
});
