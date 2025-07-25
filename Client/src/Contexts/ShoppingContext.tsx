import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addItem, removeItem, updateItem, clearCart } from '../store/cartSlice';

// Define types for our context
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface ShoppingContextType {
  cartItems: CartItem[];
  discount: number;
  applyDiscount: (amount: number) => void;
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  user: any; // added
  token: string | null; // added
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [discount, setDiscount] = useState<number>(0);

  const applyDiscount = (amount: number) => {
    setDiscount(amount);
  };

  return (
    <ShoppingContext.Provider value={{
      cartItems,
      discount,
      applyDiscount,
      addToCart: (product: any) => {
        dispatch(addItem({ ...product, quantity: 1 }));
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`
        });
      },
      removeFromCart: (id: string) => {
        dispatch(removeItem(id));
      },
      updateCartItemQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          dispatch(removeItem(id));
        } else {
          dispatch(updateItem({ id, quantity }));
        }
      },
      clearCart: () => {
        dispatch(clearCart());
      },
      user,
      token
    }}>
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error('useShoppingContext must be used within a ShoppingProvider');
  }
  return context;
};