import { Request, Response, NextFunction } from 'express';

export const logBannerRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[Banner] ${req.method} ${req.originalUrl}`);
  next();
}; 