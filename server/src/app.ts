import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/config';
import { corsOptions } from './config/cors';
import { stream } from './utils/logger';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { generalRateLimiter } from './middlewares/rateLimitMiddleware';

const app = express();

// Security and Logging
app.use(helmet());
app.use(cors(corsOptions));
app.use(
  morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined', { stream }),
);
app.use(generalRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

export default app;
