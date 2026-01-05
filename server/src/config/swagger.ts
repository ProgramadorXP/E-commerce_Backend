import swaggerJSDoc from 'swagger-jsdoc';
import { env } from '@/config/config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
      description:
        'Rest API for an e-commerce platform built with Node.js, Express and TypeScript',
      contact: {
        name: 'API Support',
        url: 'https://github.com/ProgramadorXP/E-commerce_Backend',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/schemas/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
