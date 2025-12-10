import {
  forgotPasswordApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TOrderResponse,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  getOrdersApi
);

export const newUserOrder = createAsyncThunk(
  'user/newUserOrder',
  async (data: string[]) => orderBurgerApi(data)
);
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => registerUserApi(data)
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TLoginData, 'name'>) =>
    await loginUserApi({ email, password })
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: TLoginData) => forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => resetPasswordApi(data)
);

export const getUser = createAsyncThunk('user/getUserApi', getUserApi);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const logoutUser = createAsyncThunk('user/logout', logoutApi);

export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderById',
  async (currentNumber: number) =>
    getOrderByNumberApi(currentNumber).then((data) => data)
);

export type UserState = {
  data: {
    name: string;
    email: string;
  };
  isAuthenticated: boolean;
  loginUserError: unknown;
  status: string;
  orders: TOrder[];
  lastOrder: TOrder | null;
  orderRequestData: boolean;
  currentOrder: TOrderResponse | null;
};

const initialState: UserState = {
  data: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  loginUserError: null,
  status: 'idle', // idle, loading, succeeded, failed
  orders: [],
  lastOrder: null,
  orderRequestData: false,
  currentOrder: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.status = 'succeeded';
      state.isAuthenticated = true;
    },
    setLastOrder: (state, action) => {
      state.lastOrder = action.payload;
    }
  },
  selectors: {
    getUserInfo: (state) => state.data,
    isAuthenticated: (state) => state.isAuthenticated,
    getStatus: (state) => state.status,
    getUserOrderInfo: (state) => state.orders,
    getOrderRequestStatus: (state) => state.orderRequestData,
    getLastOrder: (state) => state.lastOrder,
    getCurrentOrderInfo: (state) => state.currentOrder,
    isOrderSearchSuccess: (state) => state.currentOrder?.success
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loginUserError = null;
        state.status = 'loading';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loginUserError = action.payload;
        state.status = 'failed';
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.data = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(loginUser.pending, (state) => {
        state.isAuthenticated = false;
        state.status = 'loading';
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.status = 'failed';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.data = action.payload.user;
        state.status = 'succeeded';
      })

      .addCase(updateUser.pending, (state) => {
        state.isAuthenticated = false;
        state.status = 'loading';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.status = 'failed';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.data = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = true;
        state.status = 'failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isAuthenticated = false;
        state.data = initialState.data;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(newUserOrder.pending, (state) => {
        state.status = 'loading';
        state.orderRequestData = true;
      })
      .addCase(newUserOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.orderRequestData = false;
      })
      .addCase(newUserOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload.order);
        state.lastOrder = action.payload.order;
        state.orderRequestData = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      });
  }
});

export const {
  getUserInfo,
  isAuthenticated,
  getStatus,
  getUserOrderInfo,
  getOrderRequestStatus,
  getLastOrder,
  getCurrentOrderInfo,
  isOrderSearchSuccess
} = userSlice.selectors;

export const { loginSuccess, setLastOrder } = userSlice.actions;

export default userSlice.reducer;

export const userReducer = userSlice.reducer;
