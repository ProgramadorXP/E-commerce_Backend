import { Request, Response, NextFunction } from 'express';
import { UserRegistrationType, UserLoginType } from '../schemas/userSchemas';
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

  static login = async (
    req: Request<{}, {}, UserLoginType>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // call business logic
      const user = await AuthService.loginUser(req.body);

      res
        .status(200)
        .json({ message: 'User logged in successfully', data: user });
    } catch (error) {
      next(error);
    }
  };
}
