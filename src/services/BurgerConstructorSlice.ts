import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv } from 'uuid';

export type BurgerConstructorState = {
  bun: TIngredient | undefined;
  ingredients: TConstructorIngredient[];
};

const initialState: BurgerConstructorState = {
  bun: undefined,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type == 'bun') {
        state.bun = action.payload;
      } else {
        state.ingredients.push({
          _id: action.payload._id,
          name: action.payload.name,
          type: action.payload.type,
          proteins: action.payload.proteins,
          fat: action.payload.fat,
          carbohydrates: action.payload.carbohydrates,
          calories: action.payload.calories,
          price: action.payload.price,
          image: action.payload.image,
          image_large: action.payload.image_large,
          image_mobile: action.payload.image_mobile,
          id: uuidv()
        });
      }
    },
    moveUpIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      const currentItems = [...state.ingredients];
      const currentIndex = currentItems.findIndex((item) => item.id === id);
      if (currentIndex > 0) {
        const newItems = [...state.ingredients];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.splice(currentIndex - 1, 0, movedItem);
        return {
          ...state,
          ingredients: newItems
        };
      }
      return state;
    },
    moveDownIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      const currentItems = [...state.ingredients];
      const currentIndex = currentItems.findIndex((item) => item.id === id);

      if (currentIndex < currentItems.length - 1) {
        const newItems = [...currentItems];
        const [movedItem] = newItems.splice(currentIndex, 1);
        newItems.splice(currentIndex + 1, 0, movedItem);
        return {
          ...state,
          ingredients: newItems
        };
      }
      return state;
    },
    removeIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const { id } = action.payload;
      const currentItems = [...state.ingredients];
      const indexToRemove = currentItems.findIndex((item) => item.id === id);
      currentItems.splice(indexToRemove, 1); 
      return {
        ...state,
        ingredients: currentItems
      };
    }
  },
  selectors: {
    getBurgerConstructorData: (state) => state.ingredients,
    getBun: (state) => state.bun
  },
  extraReducers: () => {}
});

export const { getBurgerConstructorData, getBun } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;

export const { addIngredient, moveUpIngredient, moveDownIngredient, removeIngredient } =
  burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
