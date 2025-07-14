import { Request, Response } from 'express';
import { CartItem } from '../models/CartItem';

export const getAllCartItems = async (req: Request, res: Response) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

export const getCartItemById = async (req: Request, res: Response) => {
  try {
    const cartItem = await CartItem.findById(req.params.id);
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart item' });
  }
};

export const createCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = new CartItem(req.body);
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create cart item', details: err });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    res.json(cartItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update cart item', details: err });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!cartItem) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};

export const deleteAllCartItems = async (req: Request, res: Response) => {
  try {
    await CartItem.deleteMany({});
    res.json({ message: 'All cart items deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all cart items' });
  }
}; 