import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '@/middlewares/errorHandler';
import { AppError, UnauthorizedError, ConflictError } from '@/utils/errors';
import logger from '@/utils/logger';

// Mock logger to avoid console output and file writing during tests
jest.mock('@/utils/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('Global Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should handle AppError and return its status code and message', () => {
    const error = new AppError('Generic application error', 400);

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Generic application error',
    });
    expect(logger.warn).toHaveBeenCalledWith('400 - Generic application error');
  });

  it('should handle specialized errors like UnauthorizedError (instanceof AppError)', () => {
    const error = new UnauthorizedError('Unauthorized access');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unauthorized access',
    });
    expect(logger.warn).toHaveBeenCalledWith('401 - Unauthorized access');
  });

  it('should handle ConflictError correctly', () => {
    const error = new ConflictError('User already exists');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User already exists',
    });
    expect(logger.warn).toHaveBeenCalledWith('409 - User already exists');
  });

  it('should handle unknown errors by returning 500 status code', () => {
    const error = new Error('Database connection failed');

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
    expect(logger.error).toHaveBeenCalledWith('Unexpected error: ', error);
  });
});
