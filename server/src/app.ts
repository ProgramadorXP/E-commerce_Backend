import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/config';
import { corsOptions } from './config/cors';
import { swaggerSpec } from './config/swagger';
import { stream } from './utils/logger';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { generalRateLimiter } from './middlewares/rateLimitMiddleware';

const app = express();

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
