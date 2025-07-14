import { Category } from '../models/Category';

export const findAllCategories = async () => {
  return Category.find();
};

export const findCategoryById = async (id: string) => {
  return Category.findById(id);
};

export const createCategory = async (data: any) => {
  const category = new Category(data);
  return category.save();
};

export const updateCategory = async (id: string, data: any) => {
  return Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string) => {
  return Category.findByIdAndDelete(id);
}; 