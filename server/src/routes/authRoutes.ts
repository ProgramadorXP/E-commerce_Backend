import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware';
import {
  UserRegistrationSchema,
  UserLoginSchema,
} from '../schemas/userSchemas';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post(
  '/register',
  validateData(UserRegistrationSchema),
  AuthController.createAccount,
);

router.post('/login', validateData(UserLoginSchema), AuthController.login);

export default router;
