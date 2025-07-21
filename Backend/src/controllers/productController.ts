import { Request, Response } from 'express';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

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