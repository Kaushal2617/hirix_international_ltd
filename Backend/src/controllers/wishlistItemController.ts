import { Request, Response } from 'express';
import { WishlistItem } from '../models/WishlistItem';

export const getAllWishlistItems = async (req: Request, res: Response) => {
  try {
    const wishlistItems = await WishlistItem.find();
    res.json(wishlistItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist items' });
  }
};

export const getWishlistItemById = async (req: Request, res: Response) => {
  try {
    const wishlistItem = await WishlistItem.findById(req.params.id);
    if (!wishlistItem) return res.status(404).json({ error: 'Wishlist item not found' });
    res.json(wishlistItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist item' });
  }
};

export const createWishlistItem = async (req: Request, res: Response) => {
  try {
    const wishlistItem = new WishlistItem(req.body);
    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create wishlist item', details: err });
  }
};

export const updateWishlistItem = async (req: Request, res: Response) => {
  try {
    const wishlistItem = await WishlistItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wishlistItem) return res.status(404).json({ error: 'Wishlist item not found' });
    res.json(wishlistItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update wishlist item', details: err });
  }
};

export const deleteWishlistItem = async (req: Request, res: Response) => {
  try {
    const wishlistItem = await WishlistItem.findByIdAndDelete(req.params.id);
    if (!wishlistItem) return res.status(404).json({ error: 'Wishlist item not found' });
    res.json({ message: 'Wishlist item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete wishlist item' });
  }
};

export const deleteAllWishlistItems = async (req: Request, res: Response) => {
  try {
    await WishlistItem.deleteMany({});
    res.json({ message: 'All wishlist items deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all wishlist items' });
  }
}; 