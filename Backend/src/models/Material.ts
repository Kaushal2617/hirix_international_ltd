import mongoose, { Document, Schema } from 'mongoose';

export interface MaterialDocument extends Document {
  name: string;
}

const MaterialSchema = new Schema<MaterialDocument>({
  name: { type: String, required: true, unique: true },
});

export const Material = mongoose.model<MaterialDocument>('Material', MaterialSchema); 