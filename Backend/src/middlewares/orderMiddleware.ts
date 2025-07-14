import { Request, Response, NextFunction } from 'express';

export const logOrderRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Order] ${req.method} ${req.originalUrl}`);
  next();
}; 