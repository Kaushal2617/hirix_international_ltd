import { Request, Response } from 'express';
import { CartItem } from '../models/CartItem';
import { AuthRequest } from '../middlewares/authMiddleware';

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

// Get all cart items for the current user
export const getUserCart = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const cartItems = await CartItem.find({ userId });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user cart' });
  }
};

// Replace all cart items for the current user
export const setUserCart = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    // Remove all existing cart items for user
    await CartItem.deleteMany({ userId });
    // Insert new cart items
    const items = req.body.items || [];
    if (items.length === 0) return res.json([]);
    const cartItems = await CartItem.insertMany(items.map((item: any) => ({ ...item, userId })));
    res.status(201).json(cartItems);
  } catch (err) {
    res.status(400).json({ error: 'Failed to set user cart', details: err });
  }
};

// Clear all cart items for the current user
export const clearUserCart = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    await CartItem.deleteMany({ userId });
    res.json({ message: 'User cart cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear user cart' });
  }
}; 