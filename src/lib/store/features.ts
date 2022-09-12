import { IFeature } from "../types";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  EntityId,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";
import {
  addTask,
  deleteCategory,
  deleteColumn,
  deleteProject,
  deleteTask,
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
      const featuresToUpdate = Object.values(state.entities).filter(
        (feat) => feat && feat.columnId === columnId
      );
      featuresToUpdate.unshift({
        id,
        categoryId,
        columnId,
        projectId,
        name: "New Feature",
        order: 1,
        tasks: [],
        completed: false,
      });
      const features = featuresToUpdate.map((feat, idx) => ({
        ...feat,
        order: idx + 1,
      }));
      featuresAdapter.upsertMany(state, features as IFeature[]);
    },
    updateFeature: featuresAdapter.updateOne,
    deleteFeature(
      state,
      action: PayloadAction<{ id: EntityId; categoryId: string }>
    ) {
      const { id } = action.payload;
      featuresAdapter.removeOne(state, id);
    },
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
      })
      .addCase(deleteTask, (state, action) => {
        const { id, featureId } = action.payload;
        const filtered = state.entities[featureId]?.tasks.filter(
          (taskId) => taskId !== id
        ) as string[];
        featuresAdapter.updateOne(state, {
          id: featureId,
          changes: { tasks: filtered },
        });
      });
  },
});

export const { addFeature, updateFeature, deleteFeature } =
  featuresSlice.actions;

export default featuresSlice.reducer;

export const { selectById: getFeatureById } =
  featuresAdapter.getSelectors<RootState>((state) => state.features);

export const getFeaturesByCategory = (state: RootState, categoryId: string) => {
  return Object.values(state.features.entities)
    .filter((feat) => feat?.categoryId === categoryId)
    .sort((a, b) => (a?.order as number) - (b?.order as number));
};
