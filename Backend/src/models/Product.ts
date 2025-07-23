import mongoose, { Document, Schema } from 'mongoose';

export interface Variant {
  id: string;
  color: string;
  size: string;
  material: string;
  finish: string;
  price: number;
  oldPrice?: number;
  inventory: number;
  images: string[];
  description: string;
  brand?: string;
  productModel?: string;
}

const VariantSchema = new Schema<Variant>(
  {
    id: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true },
    finish: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: Number,
    inventory: { type: Number, required: true },
    images: [String],
    description: { type: String, required: true },
    brand: { type: String },
    productModel: { type: String },
  },
  { _id: false }
);

export interface ProductDocument extends Document {
  name: string;
  sku: string;
  slug: string;
  image: string;
  images?: string[];
  video?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  color: string;
  material: string;
  brand?: string;
  productModel?: string;
  description?: string;
  details?: string[];
  sale?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  inventory: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  aPlusImage?: string;
  variants?: Variant[];
  published?: boolean;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    video: String,
    price: { type: Number, required: true },
    oldPrice: Number,
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    material: { type: String, required: true },
    brand: { type: String },
    productModel: { type: String },
    description: String,
    details: [String],
    sale: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    inventory: { type: Number, required: true },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    aPlusImage: String,
    variants: [VariantSchema],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<ProductDocument>('Product', ProductSchema); 