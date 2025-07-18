// Backend/src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const ShippingAddressSchema = new Schema<ShippingAddress>(
  {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

export interface OrderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
}

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    shippingAddress: ShippingAddressSchema,
    items: [OrderItemSchema],
  }
);

export const Order = mongoose.model<OrderDocument>('Order', OrderSchema); 