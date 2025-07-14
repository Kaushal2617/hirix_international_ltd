import mongoose, { Document, Schema } from 'mongoose';

export interface WishlistItemDocument extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

const WishlistItemSchema = new Schema<WishlistItemDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, required: true },
});

export const WishlistItem = mongoose.model<WishlistItemDocument>('WishlistItem', WishlistItemSchema); 