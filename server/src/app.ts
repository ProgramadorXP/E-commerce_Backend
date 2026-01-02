import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsOptions } from './config/cors';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { generalRateLimiter } from './middlewares/rateLimitMiddleware';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(generalRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

export default app;
