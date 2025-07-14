import { CartItem } from '../models/CartItem';

export const findAllCartItems = async () => {
  return CartItem.find();
};

export const findCartItemById = async (id: string) => {
  return CartItem.findById(id);
};

export const createCartItem = async (data: any) => {
  const cartItem = new CartItem(data);
  return cartItem.save();
};

export const updateCartItem = async (id: string, data: any) => {
  return CartItem.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCartItem = async (id: string) => {
  return CartItem.findByIdAndDelete(id);
}; 