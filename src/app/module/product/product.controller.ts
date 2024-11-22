import { Response, Request, NextFunction } from 'express';
import { ProductService } from './product.service';

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productData = req.body;
    const result = await ProductService.createProductIntoDB(productData);

    res.status(200).json({
      success: true,
      message: 'Product created successfully',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const ProductController = {
  createProduct,
};
