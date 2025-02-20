import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    productId: z.string({ required_error: 'Brand is required' }),
    quantity: z.number({ required_error: 'Quantity is required' }),
    totalPrice: z.number({ required_error: 'Price is required' }),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    quantity: z.number({ required_error: 'Quantity is required' }),
    totalPrice: z.number({ required_error: 'Price is required' }),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.string({ required_error: 'Status is required' }),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
