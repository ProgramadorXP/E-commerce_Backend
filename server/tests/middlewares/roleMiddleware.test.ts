import { Request, Response, NextFunction } from 'express';
import { authorizeRole } from '@/middlewares/roleMiddleware';
import { UnauthorizedError } from '@/utils/errors';

describe('Role Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should call next() if user has an allowed role', () => {
    mockRequest.user = { id: 1, role: 'admin' };
    const middleware = authorizeRole(['admin', 'editor']);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
    expect(nextFunction).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call next with UnauthorizedError if user is not authenticated (req.user is missing)', () => {
    const middleware = authorizeRole(['admin']);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as jest.Mock).mock.calls[0][0].message).toBe(
      'User not authenticated',
    );
  });

  it('should call next with UnauthorizedError if user does not have an allowed role', () => {
    mockRequest.user = { id: 1, role: 'user' };
    const middleware = authorizeRole(['admin']);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect((nextFunction as jest.Mock).mock.calls[0][0].message).toBe(
      'You do not have permission to perform this action',
    );
  });

  it('should work with multiple allowed roles', () => {
    mockRequest.user = { id: 1, role: 'editor' };
    const middleware = authorizeRole(['admin', 'editor']);

    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });
});
