import { WishlistItem } from '../models/WishlistItem';

export const findAllWishlistItems = async () => {
  return WishlistItem.find();
};

export const findWishlistItemById = async (id: string) => {
  return WishlistItem.findById(id);
};

export const createWishlistItem = async (data: any) => {
  const wishlistItem = new WishlistItem(data);
  return wishlistItem.save();
};

export const updateWishlistItem = async (id: string, data: any) => {
  return WishlistItem.findByIdAndUpdate(id, data, { new: true });
};

export const deleteWishlistItem = async (id: string) => {
  return WishlistItem.findByIdAndDelete(id);
}; 