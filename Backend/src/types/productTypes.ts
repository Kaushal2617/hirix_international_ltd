export interface ProductInput {
  name: string;
  image: string;
  images?: string[];
  video?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  color: string;
  material: string;
  description?: string;
  details?: string[];
  newArrival?: boolean;
  inventory: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  aPlusImage?: string;
  variants?: any[];
} 