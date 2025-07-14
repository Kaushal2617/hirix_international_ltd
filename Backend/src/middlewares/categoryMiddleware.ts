import { Request, Response, NextFunction } from 'express';

export const logCategoryRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Category] ${req.method} ${req.originalUrl}`);
  next();
}; 