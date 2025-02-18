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

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    shippingAddress: z
      .string({ required_error: 'Shipping address is required' })
      .optional(),
  }),
});

const updatePhotoValidationSchema = z.object({
  body: z.object({
    photo: z.string({ required_error: 'Photo is required' }).optional(),
  }),
});

export const UserValidation = {
  changeStatusValidationSchema,
  changeBlockValidationSchema,
  updateProfileValidationSchema,
  updatePhotoValidationSchema,
};
