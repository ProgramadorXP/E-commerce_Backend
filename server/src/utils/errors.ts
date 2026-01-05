export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
