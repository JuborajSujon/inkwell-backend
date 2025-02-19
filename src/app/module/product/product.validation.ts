import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    brand: z.string({ required_error: 'Brand is required' }),
    price: z.number({ required_error: 'Price is required' }),
    category: z.enum(
      [
        'Writing',
        'Office Supplies',
        'Art Supplies',
        'Educational',
        'Technology',
      ],
      { required_error: 'Category is required' },
    ),
    model: z.string({ required_error: 'Model is required' }),
    photo: z.string({ required_error: 'Photo is required' }),
    description: z.string({ required_error: 'Description is required' }),
    quantity: z.number({ required_error: 'Quantity is required' }),
    inStock: z.boolean({ required_error: 'In stock is required' }),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    brand: z.string({ required_error: 'Brand is required' }).optional(),
    price: z.number({ required_error: 'Price is required' }).optional(),
    category: z
      .enum(
        [
          'Writing',
          'Office Supplies',
          'Art Supplies',
          'Educational',
          'Technology',
        ],
        { required_error: 'Category is required' },
      )
      .optional(),
    model: z.string({ required_error: 'Model is required' }).optional(),
    photo: z.string({ required_error: 'Photo is required' }).optional(),
    description: z
      .string({ required_error: 'Description is required' })
      .optional(),
    quantity: z.number({ required_error: 'Quantity is required' }).optional(),
    inStock: z.boolean({ required_error: 'In stock is required' }).optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
