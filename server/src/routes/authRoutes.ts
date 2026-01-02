import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware';
import {
  UserRegistrationSchema,
  UserLoginSchema,
} from '../schemas/userSchemas';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post(
  '/register',
  validateData(UserRegistrationSchema),
  AuthController.createAccount,
);

router.post('/login', validateData(UserLoginSchema), AuthController.login);

router.get('/me', authenticate, AuthController.getMe);

export default router;
