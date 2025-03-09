import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    orderItems: z
      .array(
        z.object({
          productId: z.string({ required_error: 'Product ID is required' }),
          quantity: z
            .number({ required_error: 'Quantity is required' })
            .int()
            .positive(),
          price: z.number().nonnegative().optional(),
        }),
      )
      .min(1, 'At least one product is required'),
    orderTitle: z.string({ required_error: 'Order title is required' }),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'shipping']).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};
