import { Request, Response, NextFunction } from 'express';

export const logReviewRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Review] ${req.method} ${req.originalUrl}`);
  next();
}; 