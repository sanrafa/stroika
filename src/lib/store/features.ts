import { IFeature } from "../types";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";
import {
  addTask,
  deleteCategory,
  deleteColumn,
  deleteProject,
} from "./actions";

const featuresAdapter = createEntityAdapter<IFeature>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = featuresAdapter.getInitialState();

const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    addFeature(
      state,
      action: PayloadAction<{
        id: string;
        categoryId: string;
        columnId: string;
        projectId: string;
      }>
    ) {
      const { id, categoryId, columnId, projectId } = action.payload;

      /* Increase the order of existing feats by 1, insert new feat at top */
      const toUpdate = Object.values(state.entities).map((feat) => ({
        ...feat,
        // @ts-ignore
        order: feat.order + 1,
      })) as IFeature[];
      if (toUpdate.length > 0) featuresAdapter.upsertMany(state, toUpdate);

      featuresAdapter.addOne(state, {
        id,
        categoryId,
        columnId,
        projectId,
        name: "New Feature",
        order: 1,
        tasks: [],
        completed: false,
      });
    },
    updateFeature: featuresAdapter.updateOne,
    deleteFeature: featuresAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTask, (state, action) => {
        const { id, featureId } = action.payload;
        state.entities[featureId]?.tasks.unshift(id);
      })
      .addCase(deleteProject, (state, action) => {
        const id = action.payload;
        const featuresToDelete = Object.values(state.entities)
          .filter((feat) => feat?.projectId === id)
          .map((feat) => feat?.id) as string[];
        featuresAdapter.removeMany(state, featuresToDelete);
      })
      .addCase(deleteColumn, (state, action) => {
        const { id } = action.payload;
        const featuresToDelete = Object.values(state.entities)
          .filter((feat) => feat?.columnId === id)
          .map((feat) => feat?.id) as string[];
        featuresAdapter.removeMany(state, featuresToDelete);
      })
      .addCase(deleteCategory, (state, action) => {
        const { id } = action.payload;
        const featuresToDelete = Object.values(state.entities)
          .filter((feat) => feat?.categoryId === id)
          .map((feat) => feat?.id) as string[];
        featuresAdapter.removeMany(state, featuresToDelete);
      });
  },
});

export const { addFeature, updateFeature, deleteFeature } =
  featuresSlice.actions;

export default featuresSlice.reducer;

export const { selectById: getFeatureById } =
  featuresAdapter.getSelectors<RootState>((state) => state.features);
