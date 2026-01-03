import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware';
import {
  UserRegistrationSchema,
  UserLoginSchema,
} from '../schemas/userSchemas';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorizeRole } from '../middlewares/roleMiddleware';
import { authRateLimiter } from '../middlewares/rateLimitMiddleware';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validateData(UserRegistrationSchema),
  AuthController.createAccount,
);

router.post(
  '/login',
  authRateLimiter,
  validateData(UserLoginSchema),
  AuthController.login,
);

router.get('/me', authenticate, AuthController.getMe);

// Example of a route only for admins
router.get('/admin', authenticate, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
