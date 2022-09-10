import { ICategory } from "../types";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { deleteColumn, deleteProject } from "./actions";

const categoriesAdapter = createEntityAdapter<ICategory>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = categoriesAdapter.getInitialState();

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory(
      state,
      action: PayloadAction<{
        id: string;
        columnId: string;
        projectId: string;
      }>
    ) {
      categoriesAdapter.addOne(state, {
        id: action.payload.id,
        columnId: action.payload.columnId,
        projectId: action.payload.projectId,
        order:
          Object.values(state.entities).filter(
            (cat) => cat?.columnId === action.payload.columnId
          ).length + 1,
        features: [],
        name: "New Category",
        suspended: false,
      });
    },
    updateCategory: categoriesAdapter.updateOne,
    deleteCategory(
      state,
      action: PayloadAction<{
        id: string;
        columnId: string;
      }>
    ) {
      categoriesAdapter.removeOne(state, action.payload.id);
    },
    deleteCategories: categoriesAdapter.removeMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProject, (state, action) => {
        const id = action.payload;
        const categoriesToDelete = Object.values(state.entities)
          .filter((cat) => cat?.projectId === id)
          .map((cat) => cat?.id) as string[];
        categoriesAdapter.removeMany(state, categoriesToDelete);
      })
      .addCase(deleteColumn, (state, action) => {
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
