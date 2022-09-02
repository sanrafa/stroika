import { ICategory } from "../types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const categoriesAdapter = createEntityAdapter<ICategory>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = categoriesAdapter.getInitialState();

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: categoriesAdapter.addOne,
    updateCategory: categoriesAdapter.updateOne,
    deleteCategory: categoriesAdapter.removeOne,
  },
});

export const { addCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;

export const { selectById: getCategoryById } =
  categoriesAdapter.getSelectors<RootState>((state) => state.categories);
