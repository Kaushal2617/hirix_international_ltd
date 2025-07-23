import { Request, Response } from 'express';
import { User } from '../models/User';
import mongoose from 'mongoose';

export const getUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.wishlistItems || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user wishlist' });
  }
};

export const setUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const items = req.body.items || [];
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.wishlistItems = items;
    await user.save();
    res.status(201).json(user.wishlistItems);
  } catch (err) {
    console.error('setUserWishlist error:', err);
    res.status(400).json({ error: 'Failed to set user wishlist', details: err });
  }
};

export const clearUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.wishlistItems = [];
    await user.save();
    res.json({ message: 'User wishlist cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear user wishlist' });
  }
}; 