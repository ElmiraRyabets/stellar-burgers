import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);

export type IngredientsState = {
  items: TIngredient[];
  status: string;
  error: string | undefined;
};

const initialState: IngredientsState = {
  items: [],
  status: 'idle', // idle, loading, succeeded, failed
  error: undefined,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsData: (state) => state.items,
    getState: (state) => state.status
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { getIngredientsData, getState } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;

export const ingredientsReducer = ingredientsSlice.reducer;
