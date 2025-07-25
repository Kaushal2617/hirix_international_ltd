import { Request, Response } from 'express';
import { Cart } from '../models/CartItem';
import mongoose from 'mongoose';

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const cart = await Cart.findOne({ userId });
    res.json(cart ? cart.items : []);
  } catch (err) {
    console.error('getUserCart error:', err);
    res.status(500).json({ error: 'Failed to fetch user cart' });
  }
};

export const setUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const items = req.body.items || [];
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      cart.items = items;
    }
    await cart.save();
    res.status(201).json(cart.items);
  } catch (err) {
    console.error('setUserCart error:', err);
    res.status(400).json({ error: 'Failed to set user cart', details: err });
  }
};

export const clearUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'User cart cleared' });
  } catch (err) {
    console.error('clearUserCart error:', err);
    res.status(500).json({ error: 'Failed to clear user cart' });
  }
}; 