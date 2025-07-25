import mongoose, { Document, Schema } from 'mongoose';

export interface ColorDocument extends Document {
  name: string;
}

const ColorSchema = new Schema<ColorDocument>({
  name: { type: String, required: true, unique: true },
});

export const Color = mongoose.model<ColorDocument>('Color', ColorSchema); 