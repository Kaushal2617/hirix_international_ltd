import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  inStock?: boolean;
  [key: string]: any;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: typeof window !== 'undefined' && localStorage.getItem('wishlist')
    ? (() => {
        const parsed = JSON.parse(localStorage.getItem('wishlist') as string);
        return Array.isArray(parsed) ? parsed : [];
      })()
    : [],
  loading: false,
  error: null,
};

// Thunks for backend sync
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const userId = getState().auth.user?.id || getState().auth.user?._id;
      if (!userId) return rejectWithValue('User not logged in');
      const res = await fetch(`/api/wishlist-items/user?userId=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch wishlist');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const saveWishlist = createAsyncThunk(
  'wishlist/saveWishlist',
  async (wishlist: WishlistItem[], { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const userId = getState().auth.user?.id || getState().auth.user?._id;
      if (!userId) return rejectWithValue('User not logged in');
      const res = await fetch('/api/wishlist-items/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, items: wishlist }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save wishlist');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearWishlistBackend = createAsyncThunk(
  'wishlist/clearWishlistBackend',
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const userId = getState().auth.user?.id || getState().auth.user?._id;
      if (!userId) return rejectWithValue('User not logged in');
      const res = await fetch('/api/wishlist-items/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to clear wishlist');
      return;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist(state) {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
    setWishlist(state, action: PayloadAction<WishlistItem[]>) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveWishlist.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearWishlistBackend.fulfilled, (state) => {
        state.items = [];
        localStorage.removeItem('wishlist');
      });
  },
});

export const { addItem, removeItem, clearWishlist, setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer; 