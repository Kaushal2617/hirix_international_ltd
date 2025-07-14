import { Product } from '../models/Product';

export const findAllProducts = async () => {
  return Product.find();
};

export const findProductById = async (id: string) => {
  return Product.findById(id);
};

export const createProduct = async (data: any) => {
  const product = new Product(data);
  return product.save();
};

export const updateProduct = async (id: string, data: any) => {
  return Product.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProduct = async (id: string) => {
  return Product.findByIdAndDelete(id);
}; 