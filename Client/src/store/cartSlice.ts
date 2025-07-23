import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: typeof window !== 'undefined' && localStorage.getItem('cart')
  ? (() => {
      const parsed = JSON.parse(localStorage.getItem('cart') as string);
      return Array.isArray(parsed) ? parsed : [];
    })()
  : [],
  loading: false,
  error: null,
};

// Thunks for backend sync
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const userId = getState().auth.user?.id || getState().auth.user?._id;
      if (!userId) return rejectWithValue('User not logged in');
      const res = await fetch(`/api/cart-items/user?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch cart');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveCart = createAsyncThunk(
  'cart/saveCart',
  async (cart: CartItem[], { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const userId = getState().auth.user?.id || getState().auth.user?._id;
      if (!userId) return rejectWithValue('User not logged in');
      // Normalize cart items for backend
      const normalizedItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }));
      const res = await fetch('/api/cart-items/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, items: normalizedItems }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save cart');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearCartBackend = createAsyncThunk(
  'cart/clearCartBackend',
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const userId = getState().auth.user?.id || getState().auth.user?._id;
      if (!userId) return rejectWithValue('User not logged in');
      const res = await fetch('/api/cart-items/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to clear cart');
      return;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateItem(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        localStorage.setItem('cart', JSON.stringify(state.items));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCart.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearCartBackend.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem('cart');
      });
  },
});

export const { addItem, removeItem, updateItem, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer; 