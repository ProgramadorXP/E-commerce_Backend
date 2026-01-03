import { CorsOptions } from 'cors';
import { env } from './config';

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [env.FRONTEND_URL, `http://localhost:${env.PORT}`];

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS Error: Origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
