import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const isSelfOrAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  // Check if this is an order route (order/:id)
  if (req.baseUrl.includes('/order') && req.params.id) {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (String(order.userId) === String(req.user?.userId)) {
        return next();
      }
      return res.status(403).json({ error: 'Not authorized' });
    } catch (err) {
      return res.status(500).json({ error: 'Server error', details: err });
    }
  }
  // Fallback: compare userId to param (for user routes, etc.)
  if (req.user?.userId === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: 'Not authorized' });
}; 