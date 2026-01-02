import { Request, Response, NextFunction } from 'express';
import { UserRegistrationType } from '../schemas/userSchemas';
import { AuthService } from '../services/authService';

export class AuthController {
  static createAccount = async (
    req: Request<{}, {}, UserRegistrationType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // call business logic
      const user = await AuthService.registerUser(req.body);

      res
        .status(201)
        .json({ message: 'User created successfully', data: user });
    } catch (error) {
      next(error);
    }
  };
}
