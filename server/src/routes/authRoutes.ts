import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware';
import { UserRegistrationSchema } from '../schemas/userSchemas';
import { AuthController } from '../controllers/AuthController';

const router = Router();

router.post(
  '/register',
  validateData(UserRegistrationSchema),
  AuthController.createAccount,
);

export default router;
