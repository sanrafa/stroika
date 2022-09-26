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
  sortCategoriesOnDragEnd,
  clearColumn,
} from "./actions";
import { arrayMove } from "@dnd-kit/sortable";

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
      const featuresToUpdate = Object.values(state.entities)
        .filter((feat) => feat && feat.columnId === columnId)
        .sort((a, b) => Number(a?.order) - Number(b?.order));
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
    sortFeaturesOnDragEnd(
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        prevCatId: string;
        newCatId?: string;
        prevColId?: string;
        newColId?: string;
      }>
    ) {
      const { activeId, overId, prevCatId, newCatId, prevColId, newColId } =
        action.payload;
      if (!newCatId && newColId === prevColId) {
        // within the same category
        const idList = Object.values(state.entities)
          .filter((feat) => feat?.categoryId === prevCatId)
          .sort((a, b) => Number(a?.order) - Number(b?.order))
          .map((feat) => feat?.id);
        const oldIdx = idList.indexOf(activeId);
        const newIdx = idList.indexOf(overId);
        const sortedIds = arrayMove(idList, oldIdx, newIdx);
        const featsToUpdate = sortedIds.map((id, idx) => ({
          ...state.entities[id as string],
          order: idx + 1,
        })) as IFeature[];
        featuresAdapter.upsertMany(state, featsToUpdate);
      }
      if (newCatId && newColId === prevColId) {
        // new category, same column
        const newCatFeatures = Object.values(state.entities)
          .filter((feat) => feat?.categoryId === newCatId)
          .sort((a, b) => Number(a?.order) - Number(b?.order))
          .map((feat) => feat?.id)
          .concat(activeId) as string[];
        const featuresToUpdate = newCatFeatures.map((id, idx) => {
          if (id === activeId) {
            return {
              ...state.entities[id],
              categoryId: newCatId,
              order: idx + 1,
            };
          } else {
            return {
              ...state.entities[id],
              order: idx + 1,
            };
          }
        }) as IFeature[];
        featuresAdapter.upsertMany(state, featuresToUpdate);
      } else if (newCatId && newColId !== prevColId) {
        // new category, new column
        const newCatFeatures = Object.values(state.entities)
          .filter((feat) => feat?.categoryId === newCatId)
          .sort((a, b) => Number(a?.order) - Number(b?.order))
          .map((feat) => feat?.id)
          .concat(activeId) as string[];
        const featuresToUpdate = newCatFeatures.map((id, idx) => {
          if (id === activeId) {
            return {
              ...state.entities[id],
              categoryId: newCatId,
              columnId: newColId,
              order: idx + 1,
            };
          } else {
            return {
              ...state.entities[id],
              order: idx + 1,
            };
          }
        }) as IFeature[];
        featuresAdapter.upsertMany(state, featuresToUpdate);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearColumn, (state, action) => {
        const { id } = action.payload;
        const featuresToDelete = Object.values(state.entities)
          .filter((feat) => feat?.columnId === id)
          .map((feat) => feat?.id) as string[];
        featuresAdapter.removeMany(state, featuresToDelete);
      })
      .addCase(sortCategoriesOnDragEnd, (state, action) => {
        const { activeId, newColId } = action.payload;
        if (newColId) {
          const featsToUpdate = Object.values(state.entities)
            .filter((feat) => feat?.categoryId === activeId)
            .map((feat) => ({ ...feat, columnId: newColId })) as IFeature[];
          featuresAdapter.upsertMany(state, featsToUpdate);
        }
      })
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

export const {
  addFeature,
  updateFeature,
  deleteFeature,
  sortFeaturesOnDragEnd,
} = featuresSlice.actions;

export default featuresSlice.reducer;

export const { selectById: getFeatureById } =
  featuresAdapter.getSelectors<RootState>((state) => state.features);

export const getFeaturesByCategory = (state: RootState, categoryId: string) => {
  return Object.values(state.features.entities)
    .filter((feat) => feat?.categoryId === categoryId)
    .sort((a, b) => (a?.order as number) - (b?.order as number));
};
