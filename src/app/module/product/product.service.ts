import { TProduct } from './product.interface';
import { Product } from './product.model';

// Create a new product
const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

// Get all products with if query search term is provided
const getAllProudctsFromDB = async (searchTerm?: string) => {
  const query: Record<string, any> = {};

  // if search term is provided
  if (searchTerm) {
    const regex = new RegExp(searchTerm, 'i'); // 'i' flag for case-insensitive search
    Object.assign(query, {
      $or: [
        { name: { $regex: regex } },
        { brand: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    });
  }

  // find products with the search term
  const result = await Product.find(query);
  return result;
};

// Get specific product by id from the database
const getProductByIdFromDB = async (id: string) => {
  const result = await Product.findById(id);

  // if product not found
  if (!result) throw new Error('Product not found');
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
  if (!updatedProduct) throw new Error('Product not found');

  return updatedProduct;
};

// Delete specific product by id from the database
const deleteProductByIdFromDB = async (id: string) => {
  const result = await Product.updateOne({ _id: id }, { isDeleted: true });

  // if product not found
  if (result.matchedCount === 0) throw new Error('Product not found');

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProudctsFromDB,
  getProductByIdFromDB,
  updatedProductInDB,
  deleteProductByIdFromDB,
};
