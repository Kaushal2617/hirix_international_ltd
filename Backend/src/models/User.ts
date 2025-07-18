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

export interface UserDocument extends Document {
  name: string;
  email: string;
  contact: string;
  password: string;
  role: 'user' | 'admin';
  addresses: Address[];
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String }, // made optional for registration flexibility
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  addresses: { type: [AddressSchema], required: false }, // made optional for registration flexibility
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Number },
}, { timestamps: true });

export const User = mongoose.model<UserDocument>('User', UserSchema); 