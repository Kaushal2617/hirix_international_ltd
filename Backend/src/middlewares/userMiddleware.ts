import { Request, Response, NextFunction } from 'express';

export const logUserRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[User] ${req.method} ${req.originalUrl}`);
  next();
}; 