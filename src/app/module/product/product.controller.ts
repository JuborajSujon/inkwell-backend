import { Response, Request, NextFunction } from 'express';
import { ProductService } from './product.service';

// Create a new product
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
  } catch (error) {
    next(error);
  }
};

// Get all products
const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchTerm } = req.query;

    // Fetch products from the database
    const result = await ProductService.getAllProudctsFromDB(
      searchTerm as string,
    );

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
};
