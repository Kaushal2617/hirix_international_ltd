import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { allProducts } from '../data/products'; // mock data, can be removed in future

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [], // start with empty, not mock data
    loading: false,
    error: null,
  },
  reducers: {
    setProducts(state, action) {
      state.products = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // only real data
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
        // Do not overwrite products with mock data
      });
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer; 