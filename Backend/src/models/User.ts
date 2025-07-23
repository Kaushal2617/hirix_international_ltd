import mongoose, { Document, Schema } from 'mongoose';

export interface Address {
  id: number;
  label: string;
  address: string;
  postcode: string;
  phone: string;
}

const AddressSchema = new Schema<Address>({
  id: { type: Number, required: true },
  label: { type: String, required: true },
  address: { type: String, required: true },
  postcode: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false });

export interface CartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface WishlistItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  contact: string;
  password: string;
  role: 'user' | 'admin';
  addresses: Address[];
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

const CartItemSchema = new Schema<CartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const WishlistItemSchema = new Schema<WishlistItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  inStock: { type: Boolean, required: true },
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String }, // made optional for registration flexibility
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: { type: [AddressSchema], required: false }, // made optional for registration flexibility
  cartItems: { type: [CartItemSchema], default: [] },
  wishlistItems: { type: [WishlistItemSchema], default: [] },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Number },
}, { timestamps: true });

export const User = mongoose.model<UserDocument>('User', UserSchema); 