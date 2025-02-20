import status from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.contant';

// Create a new product
const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

// Get all products with if query search term is provided
const getAllProudctsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find().select('-isDeleted'),
    query,
  )
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;

  return { result, meta };
};

// Get specific product by id from the database
const getProductByIdFromDB = async (id: string) => {
  const result = await Product.findById(id).select('-isDeleted');

  // if product not found
  if (!result) throw new AppError(status.NOT_FOUND, 'Resource not found');

  return result;
};

// Update specific product by id from the database
const updatedProductInDB = async (
  id: string,
  updateData: Partial<TProduct>,
) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  // if product not found
  if (!updatedProduct)
    throw new AppError(status.NOT_FOUND, 'Resource not found');

  return updatedProduct;
};

// Delete specific product by id from the database
const deleteProductByIdFromDB = async (id: string) => {
  const result = await Product.updateOne({ _id: id }, { isDeleted: true });

  // if product not found
  if (result.matchedCount === 0)
    throw new AppError(status.NOT_FOUND, 'Resource not found');

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProudctsFromDB,
  getProductByIdFromDB,
  updatedProductInDB,
  deleteProductByIdFromDB,
};
