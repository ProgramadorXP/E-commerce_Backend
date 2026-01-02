import argon2 from 'argon2';
import { prisma } from '../lib/prisma';
import { UserRegistrationType, UserLoginType } from '../schemas/userSchemas';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors';
export class AuthService {
  static async registerUser(userData: UserRegistrationType) {
    const { username, email, password } = userData;

    // Check if username or email already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      // throw error
      throw new ConflictError('Username already exists');
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      // throw error
      throw new ConflictError('Email already exists');
    }

    // Check if role exists
    const role = await prisma.role.findUnique({ where: { name: 'user' } });
    if (!role) {
      // throw error
      throw new NotFoundError('Default role not found');
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: { connect: { id: role!.id } },
      },

      // select what we want to return
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  static async loginUser(userData: UserLoginType) {
    const { identifier, password } = userData;

    // Check if user or email exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });
    if (!user) {
      // throw error
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if password is correct
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      // throw error
      throw new UnauthorizedError('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
