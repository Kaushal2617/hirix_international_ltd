import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

// Define types for our context
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

interface ShoppingContextType {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  discount: number;
  applyDiscount: (amount: number) => void;
  addToCart: (product: any) => void;
  addToWishlist: (product: any) => void;
  removeFromCart: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  clearWishlist: () => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  const applyDiscount = (amount: number) => {
    setDiscount(amount);
  };

  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      // Check if product already exists in cart
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If it exists, increase quantity
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // If not, add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  const addToWishlist = (product: any) => {
    setWishlistItems(prevItems => {
      // Check if product already exists in wishlist
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // If it exists, don't add it again
        toast({
          title: "Already in Wishlist",
          description: `${product.name} is already in your wishlist.`
        });
        return prevItems;
      } else {
        // If not, add new item
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`
        });
        return [...prevItems, { 
          id: product.id, 
          name: product.name,
          price: product.price,
          image: product.image,
          inStock: true
        }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <ShoppingContext.Provider value={{
      cartItems,
      wishlistItems,
      discount,
      applyDiscount,
      addToCart,
      addToWishlist,
      removeFromCart,
      removeFromWishlist,
      updateCartItemQuantity,
      clearCart,
      clearWishlist
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