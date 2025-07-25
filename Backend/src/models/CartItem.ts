import mongoose, { Document, Schema } from 'mongoose';

export interface CartProduct {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartProduct[];
}

const CartProductSchema = new Schema<CartProduct>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const CartSchema = new Schema<CartDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [CartProductSchema], default: [] },
});

export const Cart = mongoose.model<CartDocument>('Cart', CartSchema); 