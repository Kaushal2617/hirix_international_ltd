import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from '@/contexts/ShoppingContext';

interface CartItemRowProps {
  item: CartItem;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ 
  item, 
  updateQuantity, 
  removeItem 
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <img 
            src={item.image} 
            alt={item.name} 
            className="h-16 w-16 object-cover bg-gray-100 rounded-md"
          />
          <Link to={`/product/${item.id}`} className="font-medium hover:underline">
            {item.name}
          </Link>
        </div>
      </TableCell>
      <TableCell>£{item.price.toFixed(2)}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="font-medium">
        £{(item.price * item.quantity).toFixed(2)}
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItemRow;