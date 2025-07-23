import { Request, Response } from 'express';
import { Product } from '../models/Product';
import mongoose from 'mongoose';
import { Category } from '../models/Category';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ published: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = { ...req.body };
    if (typeof productData.published === 'undefined') {
      productData.published = true;
    }
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product', details: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update product', details: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product', details: err });
  }
};

export const deleteAllProducts = async (req: Request, res: Response) => {
  try {
    await Product.deleteMany({});
    res.json({ message: 'All products deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all products' });
  }
};

export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await Product.find(); // No published filter
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const query = req.query.query || '';
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.json([]);
    }
    // Search categories
    const categories = await Category.find({ name: { $regex: query, $options: 'i' } });
    // Search subcategories (embedded in categories)
    const subcategories = await Category.aggregate([
      { $unwind: '$subcategories' },
      { $match: { 'subcategories.name': { $regex: query, $options: 'i' } } },
      { $replaceRoot: { newRoot: '$subcategories' } }
    ]);
    // Search products
    const products = await Product.find({ name: { $regex: query, $options: 'i' } });

    const suggestions = [
      ...categories.map(cat => ({ type: 'category', name: cat.name, slug: cat.slug })),
      ...subcategories.map(sub => ({ type: 'subcategory', name: sub.name, slug: sub.slug })),
      // ...products.map(prod => ({ type: 'product', name: prod.name, slug: prod.slug })),
    ];
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search suggestions' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}; 