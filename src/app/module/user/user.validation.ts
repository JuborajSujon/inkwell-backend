import { z } from 'zod';
import { USER_STATUS } from './user.constant';

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...USER_STATUS] as [string, ...string[]]),
  }),
});

const changeBlockValidationSchema = z.object({
  body: z.object({
    isBlocked: z.boolean(),
  }),
});

export const UserValidation = {
  changeStatusValidationSchema,
  changeBlockValidationSchema,
};
