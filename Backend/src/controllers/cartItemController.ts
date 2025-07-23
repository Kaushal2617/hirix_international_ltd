import { Request, Response } from 'express';
import { User } from '../models/User';
import mongoose from 'mongoose';

export const getUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.cartItems || []);
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
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.cartItems = items;
    await user.save();
    res.status(201).json(user.cartItems);
  } catch (err) {
    console.error('setUserCart error:', err);
    res.status(400).json({ error: 'Failed to set user cart', details: err });
  }
};

export const clearUserCart = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.cartItems = [];
    await user.save();
    res.json({ message: 'User cart cleared' });
  } catch (err) {
    console.error('clearUserCart error:', err);
    res.status(500).json({ error: 'Failed to clear user cart' });
  }
}; 