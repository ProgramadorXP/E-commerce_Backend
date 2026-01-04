import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateData } from '../../src/middlewares/validationMiddleware';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  const testSchema = z.object({
    body: z.object({
      name: z.string().min(3),
    }),
    query: z.object({
      page: z.string().optional(),
    }),
    params: z.object({
      id: z.string().optional(),
    }),
  });

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() if data matches schema', () => {
    mockRequest.body = { name: 'John Doe' };
    const middleware = validateData(testSchema as any);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    mockRequest.body = { name: 'Jo' }; // Too short
    const middleware = validateData(testSchema as any);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Array),
      }),
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should correctly format Zod validation errors', () => {
    mockRequest.body = { name: 123 }; // Wrong type
    const middleware = validateData(testSchema as any);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    const jsonCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(jsonCall.error[0]).toHaveProperty('message');
    expect(jsonCall.error[0]).toHaveProperty('path', 'name');
  });
});
