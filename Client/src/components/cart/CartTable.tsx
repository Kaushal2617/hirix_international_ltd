import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem } from '@/contexts/ShoppingContext';
import CartItemRow from './CartItemRow';

interface CartTableProps {
  cartItems: CartItem[];
  updateCartItemQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartTable: React.FC<CartTableProps> = ({
  cartItems,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartItems.map((item) => (
            <CartItemRow 
              key={item.id}
              item={item}
              updateQuantity={updateCartItemQuantity}
              removeItem={removeFromCart}
            />
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-between">
        <Link to="/all-products">
          <Button variant="outline" className="flex items-center">
            Continue Shopping
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="flex items-center text-red-500"
          onClick={clearCart}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>
    </>
  );
};

export default CartTable;
