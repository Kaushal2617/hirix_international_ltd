import mongoose, { Document, Schema } from 'mongoose';

export interface BannerDocument extends Document {
  imageUrl: string;
  mobileImageUrl?: string;
  type: 'hero' | 'mini';
  category?: string;
  link?: string;
  title?: string;
}

const BannerSchema = new Schema<BannerDocument>({
  imageUrl: { type: String, required: true },
  mobileImageUrl: String,
  type: { type: String, enum: ['hero', 'mini'], required: true },
  category: String,
  link: String,
  title: String,
});

export const Banner = mongoose.model<BannerDocument>('Banner', BannerSchema); 