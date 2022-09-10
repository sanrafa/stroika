import { ICategory } from "../types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { deleteColumn } from "./actions";

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
    deleteCategories: categoriesAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteColumn, (state, action) => {
      const { id } = action.payload;
      const categoriesToDelete = Object.values(state.entities)
        .filter((cat) => cat?.columnId === id)
        .map((cat) => cat?.id);
      categoriesSlice.caseReducers.deleteCategories(
        state,
        categoriesToDelete as string[]
      );
    });
  },
});

export const { addCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;

export const { selectById: getCategoryById } =
  categoriesAdapter.getSelectors<RootState>((state) => state.categories);
