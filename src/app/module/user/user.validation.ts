import { z } from 'zod';

const createUserValidationSchema = z.object({
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
});

export const UserValidation = {
  createUserValidationSchema,
};
