export interface ReviewInput {
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt?: Date;
} 