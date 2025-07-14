import { Request, Response } from 'express';
import { Order } from '../models/Order';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create order', details: err });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order', details: err });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const deleteAllOrders = async (req: Request, res: Response) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'All orders deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete all orders' });
  }
}; 