import { Request, Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import mongoose from 'mongoose';

export const getUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const wishlist = await Wishlist.findOne({ userId });
    res.json(wishlist ? wishlist.items : []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user wishlist' });
  }
};

export const setUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const items = req.body.items || [];
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items });
    } else {
      wishlist.items = items;
    }
    await wishlist.save();
    res.status(201).json(wishlist.items);
  } catch (err) {
    res.status(400).json({ error: 'Failed to set user wishlist', details: err });
  }
};

export const clearUserWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.items = [];
      await wishlist.save();
    }
    res.json({ message: 'User wishlist cleared' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear user wishlist' });
  }
};

export const addWishlistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const item = req.body.item;
    if (!item) return res.status(400).json({ error: 'item is required' });
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [item] });
    } else {
      // Prevent duplicates
      if (!wishlist.items.some(i => i.productId.equals(item.productId))) {
        wishlist.items.push(item);
      }
    }
    await wishlist.save();
    res.status(201).json(wishlist.items);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add wishlist item', details: err });
  }
};

export const removeWishlistItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const productId = req.body.productId || req.params.productId;
    if (!userId || !productId) return res.status(400).json({ error: 'userId and productId are required' });
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(i => !i.productId.equals(productId));
      await wishlist.save();
    }
    res.json({ message: 'Wishlist item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove wishlist item' });
  }
}; 