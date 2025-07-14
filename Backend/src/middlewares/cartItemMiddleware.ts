import { Request, Response, NextFunction } from 'express';

export const logCartItemRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[CartItem] ${req.method} ${req.originalUrl}`);
  next();
}; 