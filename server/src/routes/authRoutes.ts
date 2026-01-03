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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               passwordConfirmation:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Conflict (Username or email already exists)
 *       400:
 *         description: Bad Request (Validation failed)
 */
router.post(
  '/register',
  authRateLimiter,
  validateData(UserRegistrationSchema),
  AuthController.createAccount,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username or email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized (Invalid credentials)
 */
router.post(
  '/login',
  authRateLimiter,
  validateData(UserLoginSchema),
  AuthController.login,
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Unauthorized (No token or invalid token)
 */
router.get('/me', authenticate, AuthController.getMe);

// Example of a route only for admins
router.get('/admin', authenticate, authorizeRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

export default router;
