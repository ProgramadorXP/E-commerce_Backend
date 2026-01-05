import request from 'supertest';
import app from '@/app';
import { prisma } from '@/lib/prisma';

describe('Auth Endpoints', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    passwordConfirmation: 'Password123!',
  };

  // Clean up database before and after tests
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        OR: [{ email: testUser.email }, { username: testUser.username }],
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message');
      // Fix: API returns user inside 'data'
      expect(res.body.data).toHaveProperty('email', testUser.email);
    });

    it('should NOT register a user with an existing email', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);

      expect(res.statusCode).toEqual(409);
    });

    it('should NOT register a user with invalid data (Zod validation)', async () => {
      const invalidUser = { ...testUser, email: 'not-an-email' };
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return a token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        identifier: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should NOT login with wrong credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        identifier: testUser.email,
        password: 'WrongPassword!',
      });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/auth/me', () => {
    let token: string;

    beforeAll(async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        identifier: testUser.email,
        password: testUser.password,
      });
      token = loginRes.body.token;
    });

    it('should get current user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      // Fix: Controller returns profile inside 'data'
      expect(res.body.data).toHaveProperty('id');
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toEqual(401);
    });
  });
});
