import { ICategory } from "../types";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";
import {
  addFeature,
  deleteColumn,
  deleteFeature,
  deleteProject,
} from "./actions";

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
      const { id, columnId, projectId } = action.payload;
      const toUpdate = Object.values(state.entities)
        .filter((cat) => cat?.columnId === columnId)
        .map((cat) => ({
          ...cat,
          order: (cat?.order as number) + 1,
        })) as ICategory[];
      categoriesAdapter.upsertMany(state, toUpdate);
      categoriesAdapter.addOne(state, {
        id: id,
        columnId: columnId,
        projectId: projectId,
        order: 1,
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
      })
      .addCase(deleteFeature, (state, action) => {
        const { id, categoryId } = action.payload;

        const filtered = state.entities[categoryId]?.features.filter(
          (feat) => feat !== id
        ) as string[];
        categoriesAdapter.updateOne(state, {
          id: categoryId,
          changes: { features: filtered },
        });
      })
      .addCase(addFeature, (state, action) => {
        const { id, categoryId } = action.payload;
        state.entities[categoryId]?.features.unshift(id);
      });
  },
});

export const { addCategory, updateCategory, deleteCategory } =
  categoriesSlice.actions;

export default categoriesSlice.reducer;

export const { selectById: getCategoryById } =
  categoriesAdapter.getSelectors<RootState>((state) => state.categories);
