import { Request, Response } from 'express';
import { Category } from '../models/Category';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    // Map _id to id for frontend compatibility
    const categoriesWithId = categories.map((cat: any) => ({
      ...cat.toObject(),
      id: cat.id,
    }));
    res.json(categoriesWithId);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    // Map _id to id
    const categoryWithId = { ...category.toObject(), id: category.id };
    res.json(categoryWithId);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    await category.save();
    // Map _id to id
    const categoryWithId = { ...category.toObject(), id: category.id };
    res.status(201).json(categoryWithId);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create category', details: err });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    // Map _id to id
    const categoryWithId = { ...category.toObject(), id: category.id };
    res.json(categoryWithId);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update category', details: err });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const deleteAllCategories = async (req: Request, res: Response) => {
  try {
    await Category.deleteMany({});
    res.json({ message: 'All categories deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all categories' });
  }
}; 