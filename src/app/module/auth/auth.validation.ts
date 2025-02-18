import { z } from 'zod';

const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name must be provided and must be a string',
    }),
    email: z
      .string({
        required_error: 'Email must be provided and must be a string',
      })
      .email(),
    password: z.string({
      required_error: 'Password must be provided and must be a string',
    }),
  }),
});

const loginValidatioinSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const AuthValidations = {
  registerUserValidationSchema,
  loginValidatioinSchema,
};
