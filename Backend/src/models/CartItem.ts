import mongoose, { Document, Schema } from 'mongoose';

export interface CartItemDocument extends Document {
  userId: mongoose.Types.ObjectId;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const CartItemSchema = new Schema<CartItemDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
});

export const CartItem = mongoose.model<CartItemDocument>('CartItem', CartItemSchema); 