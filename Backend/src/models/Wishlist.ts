import mongoose, { Document, Schema } from 'mongoose';

export interface WishlistProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface WishlistDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: WishlistProduct[];
}

const WishlistProductSchema = new Schema<WishlistProduct>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, required: true },
}, { _id: false });

const WishlistSchema = new Schema<WishlistDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [WishlistProductSchema], default: [] },
});

export const Wishlist = mongoose.model<WishlistDocument>('Wishlist', WishlistSchema); 