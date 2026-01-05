import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '@/middlewares/authMiddleware';
import { UnauthorizedError } from '@/utils/errors';
import { env } from '@/config/config';

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() and attach user to request if a valid token is provided', () => {
    const mockUser = { id: 1, role: 'user' };
    mockRequest.headers!.authorization = 'Bearer valid-token';
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', env.JWT_SECRET);
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should call next with UnauthorizedError if no authorization header is present', () => {
    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as jest.Mock).mock.calls[0][0].message).toBe(
      'No token provided',
    );
  });

  it('should call next with UnauthorizedError if authorization header does not start with Bearer', () => {
    mockRequest.headers!.authorization = 'Basic basic-token';

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as jest.Mock).mock.calls[0][0].message).toBe(
      'No token provided',
    );
  });

  it('should call next with UnauthorizedError if token is invalid', () => {
    mockRequest.headers!.authorization = 'Bearer invalid-token';
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as jest.Mock).mock.calls[0][0].message).toBe(
      'Invalid or expired token',
    );
  });
});
