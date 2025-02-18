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

const changePasswordValidatioinSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'user email is required' }).email(),
  }),
});

const resetPasswordValidationSchem = z.object({
  body: z.object({
    email: z.string({ required_error: 'user email is required' }).email(),
    newPassword: z.string({ required_error: 'New Password is required' }),
  }),
});

export const AuthValidations = {
  registerUserValidationSchema,
  loginValidatioinSchema,
  changePasswordValidatioinSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchem,
};
