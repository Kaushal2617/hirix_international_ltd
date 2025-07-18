import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  image?: string;
  items?: number;
  link: string;
  subcategories?: { id: string; name: string; slug: string }[];
}

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  items: Number,
  link: { type: String, required: true },
  subcategories: [
    {
      id: String,
      name: String,
      slug: String,
    }
  ],
});

export const Category = mongoose.model<CategoryDocument>('Category', CategorySchema); 