import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockCategories from '../data/mockCategories';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return Array.isArray(data)
        ? data.map(cat => ({ ...cat, subcategories: cat.subcategories || [] }))
        : [];
    } catch (err) {
      return rejectWithValue('Failed to fetch categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: mockCategories,
    loading: false,
    error: null,
  },
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.length ? action.payload : mockCategories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        state.categories = mockCategories;
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer; 