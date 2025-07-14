export interface OrderInput {
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  shippingAddress: string;
  createdAt?: Date;
  updatedAt?: Date;
} 