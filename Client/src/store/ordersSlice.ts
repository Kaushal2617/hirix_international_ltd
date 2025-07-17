import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (userId?: string, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      // Prevent sending userId=undefined as a string
      const shouldSendUserId = userId && userId !== 'undefined';
      const url = shouldSendUserId ? `http://localhost:5000/api/orders?userId=${userId}` : `http://localhost:5000/api/orders`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch order');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, updates }: { id: string; updates: any }, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete order');
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrdersByUserId = createAsyncThunk(
  'orders/fetchOrdersByUserId',
  async (userId: string, { getState, rejectWithValue }) => {
    try {
      // @ts-ignore
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/api/orders?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
      return { userId, orders: data };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o: any) => o.id === action.payload.id || o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o: any) => o.id !== action.payload && o._id !== action.payload);
      });
  },
});

export default ordersSlice.reducer; 