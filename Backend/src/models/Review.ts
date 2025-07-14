import mongoose, { Document, Schema } from 'mongoose';

export interface ReviewDocument extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.model<ReviewDocument>('Review', ReviewSchema); 