import { Request, Response, NextFunction } from 'express';

export const logProductRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Product] ${req.method} ${req.originalUrl}`);
  next();
}; 