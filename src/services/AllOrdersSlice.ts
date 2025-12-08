import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getAllOrders = createAsyncThunk('orders/getAllOrders', async () =>
  getFeedsApi()
);

export type OrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  status: string;
  error: string | undefined;
};

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  status: 'idle', // idle, loading, succeeded, failed
  error: undefined
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  selectors: {
    getOrdersData: (state) => state.orders,
    getState: (state) => state.status,
    getTotal: (state) => state.total,
    getTotalToday: (state) => state.totalToday
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { getOrdersData, getState, getTotal, getTotalToday } =
  ordersSlice.selectors;

export default ordersSlice.reducer;

export const ordersReducer = ordersSlice.reducer;
