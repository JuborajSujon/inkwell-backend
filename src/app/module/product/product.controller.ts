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
      message: 'Product created successfully',
      success: true,
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
      message: 'Products retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific product by id
const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    // Fetch product from the database
    const result = await ProductService.getProductByIdFromDB(productId);

    res.status(200).json({
      message: 'Products retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
};
