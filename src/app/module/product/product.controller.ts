import { Response, Request } from 'express';
import { ProductService } from './product.service';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

// Create a new product
const createProduct = catchAsync(async (req: Request, res: Response) => {
  // Get product data from request body
  const productData = req.body;
  const result = await ProductService.createProductIntoDB(productData);

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

// Get all products
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  // Fetch products from the database
  const result = await ProductService.getAllProudctsFromDB(req.query);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Get a specific product by id
const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;

  // Fetch product from the database
  const result = await ProductService.getProductByIdFromDB(productId);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

// Update a specific product by id
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  // Get product data from request body
  const { productId } = req.params;
  const updateData = req.body;

  // Update product in the database
  const updatedProduct = await ProductService.updatedProductInDB(
    productId,
    updateData,
  );

  // if product not found in the database
  if (!updatedProduct) {
    sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: 'Resource not found',
      data: null,
    });
  }

  // if product found in the database
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct,
  });
});

// Delete a specific product by id
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  // Get product id from request params
  const { productId } = req.params;

  // Delete product from the database
  const deletedProduct =
    await ProductService.deleteProductByIdFromDB(productId);

  // if product not found in the database
  if (!deletedProduct) {
    sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: 'Product not found',
      data: null,
    });
  }

  // if product found in the database
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Product deleted successfully',
    data: {},
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
