import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Banner } from '../data/banners';

export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async (_, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch('http://localhost:5000/api/banners', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch banners');
      // Patch: always provide id for banners
      if (Array.isArray(data)) {
        return data.map((b) => ({ ...b, id: b._id || b.id }));
      }
      return { ...data, id: data._id || data.id };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addBanner = createAsyncThunk(
  'banners/addBanner',
  async (banner: Partial<Banner>, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch('http://localhost:5000/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(banner),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add banner');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  'banners/updateBanner',
  async ({ id, updates }: { id: string; updates: Partial<Banner> }, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update banner');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banners/deleteBanner',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete banner');
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const bannerSlice = createSlice({
  name: 'banners',
  initialState: {
    banners: [] as Banner[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
        state.error = null;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        const idx = state.banners.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.banners[idx] = action.payload;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(b => b.id !== action.payload);
      });
  },
});

export default bannerSlice.reducer; 