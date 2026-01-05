import { rateLimit } from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting during tests
  message: {
    message:
      'Too many attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 100, // Limit each IP to 100 requests per `window`
  message: {
    message: 'Too many requests from this IP, please try again after an hour',
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
