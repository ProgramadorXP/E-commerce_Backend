import { z } from 'zod';

export const UserRegistrationSchema = z.strictObject({
  body: z
    .object({
      username: z
        .string({ error: 'Username is required' })
        .min(3, { error: 'Username must be at least 3 characters long' })
        .max(30, { error: 'Username must be at most 30 characters long' }),
      email: z.email({ error: 'Valid email is required' }),
      password: z
        .string({ error: 'Password is required' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
          error: 'Password does not meet security requirements',
        }),
      passwordConfirmation: z.string({
        error: 'Password confirmation is required',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      error: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type UserRegistrationType = z.infer<
  typeof UserRegistrationSchema
>['body'];
