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

    res.status(201).json({
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

    // if no products found in the database
    if (result.length === 0) {
      res.status(404).json({
        message: 'Resource not found',
        success: false,
        data: result,
      });
    } else {
      res.status(200).json({
        message: 'Products retrieved successfully',
        success: true,
        data: result,
      });
    }
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

// Update a specific product by id
const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Update product in the database
    const updatedProduct = await ProductService.updatedProductInDB(
      productId,
      updateData,
    );

    // if product not found in the database
    if (!updatedProduct) {
      res.status(404).json({
        message: 'Resource not found',
        success: false,
        data: null,
      });
    }

    // if product found in the database
    res.status(200).json({
      message: 'Product updated successfully',
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a specific product by id
const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    // Delete product from the database
    const deletedProduct =
      await ProductService.deleteProductByIdFromDB(productId);

    // if product not found in the database
    if (!deletedProduct) {
      res.status(404).json({
        message: 'Product not found',
        success: false,
        data: null,
      });
    }

    // if product found in the database
    res.status(200).json({
      message: 'Product deleted successfully',
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
