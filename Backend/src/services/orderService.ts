import { Order } from '../models/Order';

export const findAllOrders = async () => {
  return Order.find();
};

export const findOrderById = async (id: string) => {
  return Order.findById(id);
};

export const createOrder = async (data: any) => {
  const order = new Order(data);
  return order.save();
};

export const updateOrder = async (id: string, data: any) => {
  return Order.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOrder = async (id: string) => {
  return Order.findByIdAndDelete(id);
}; 