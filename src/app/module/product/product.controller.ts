import { Response, Request } from 'express';
import { Product } from './product.model';

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const result = await Product.create(productData);

    res.status(200).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server Error',
      error: error,
    });
  }
};

export const ProductController = {
  createProduct,
};
