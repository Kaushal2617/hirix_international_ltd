import { Request, Response, NextFunction } from 'express';

export const logWishlistItemRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[WishlistItem] ${req.method} ${req.originalUrl}`);
  next();
}; 