import status from 'http-status';
import AppError from '../../errors/AppError';
import { ICart, ICartItem } from './cart.interface';
import { Cart } from './cart.model';
import { Product } from '../product/product.model';

const createAndUpdateCartIntoDB = async (cartData: Partial<ICart>) => {
  const { items, userEmail } = cartData;

  if (!userEmail || !items) {
    throw new AppError(status.BAD_REQUEST, 'User email and items are required');
  }

  // Ensure items is always an array
  const itemList = Array.isArray(items) ? items : [items];

  let cart = await Cart.findOne({ userEmail });

  if (!cart) {
    cart = new Cart({ userEmail, items: [], totalPrice: 0 });
  }

  for (const newItem of itemList) {
    // Fetch the latest product price
    const product = await Product.findById(newItem.productId);
    if (!product) {
      throw new AppError(status.NOT_FOUND, 'Product not found');
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === newItem.productId.toString(),
    );

    if (existingItemIndex > -1) {
      // Update quantity and set price dynamically
      cart.items[existingItemIndex].quantity = newItem.quantity;
      cart.items[existingItemIndex].price = product.price * newItem.quantity;
    } else {
      // Add new item with correct price
      cart.items.push({
        productId: newItem.productId,
        quantity: newItem.quantity,
        price: product.price * newItem.quantity, // Fetch the latest price
      } as ICartItem);
    }
  }

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + (item.price || 0),
    0,
  );

  await cart.save();
  return cart;
};
const getCartByUserEmail = async (userEmail: string) => {
  const cart = await Cart.findOne({ userEmail }).populate('items.productId');

  if (!cart) {
    throw new AppError(status.NOT_FOUND, 'Cart not found');
  }
  return cart;
};

const deleteSingleCartFromDB = async (userEmail: string, productId: string) => {
  if (!userEmail)
    throw new AppError(status.BAD_REQUEST, 'User email is required');
  if (!productId)
    throw new AppError(status.BAD_REQUEST, 'Product ID is required');

  const cart = await Cart.findOne({ userEmail });

  if (!cart) throw new AppError(status.NOT_FOUND, 'Cart not found');

  // filter out the item to be deleted
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  // Recalculate total price
  cart.totalPrice = cart.items.reduce(
    (total, item) => total + (item.price || 0),
    0,
  );

  await cart.save();
  return cart;
};

const deleteUserCartFromDB = async (userEmail: string) => {
  if (!userEmail)
    throw new AppError(status.BAD_REQUEST, 'User email is required');

  const cart = await Cart.findOneAndDelete({ userEmail });

  if (!cart) throw new AppError(status.NOT_FOUND, 'Cart not found');

  return cart;
};

export const CartService = {
  createAndUpdateCartIntoDB,
  getCartByUserEmail,
  deleteSingleCartFromDB,
  deleteUserCartFromDB,
};
