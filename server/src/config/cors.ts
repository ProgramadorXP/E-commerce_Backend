import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_URL];

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Error de CORS: Origen no permitido'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
