import { ICategory } from "../types";
import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  nanoid,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";
import {
  addFeature,
  clearColumn,
  deleteColumn,
  deleteFeature,
  deleteProject,
  sortFeaturesOnDragEnd,
} from "./actions";
import { arrayMove } from "@dnd-kit/sortable";

const categoriesAdapter = createEntityAdapter<ICategory>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = categoriesAdapter.getInitialState();

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    copyCategoriesFromColumn(
      state,
      action: PayloadAction<{
        fromId: string;
        toId: string;
      }>
    ) {
      const { fromId, toId } = action.payload;
      const catsToCopy = Object.values(state.entities)
        .filter((cat) => cat?.columnId === fromId)
        .sort((a, b) => Number(a?.order) - Number(b?.order))
        .map((cat) => ({
          id: nanoid(5),
          columnId: toId,
          projectId: cat?.projectId,
          order: 1,
          features: [],
          name: cat?.name,
          suspended: false,
        })) as ICategory[];
      const toCategories = Object.values(state.entities)
        .filter((cat) => cat?.columnId === toId)
        .sort((a, b) => Number(a?.order) - Number(b?.order));
      const categories = [...catsToCopy, ...toCategories].map((cat, idx) => ({
        ...cat,
        order: idx + 1,
      })) as ICategory[];
      categoriesAdapter.upsertMany(state, categories);
    },
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
      toUpdate.push({
        id: id,
        columnId: columnId,
        projectId: projectId,
        order: 1,
        features: [],
        name: "New Category",
        suspended: false,
      });
      categoriesAdapter.upsertMany(state, toUpdate);
    },
    toggleCategorySuspended(
      state,
      action: PayloadAction<{
        id: string;
        suspended: boolean;
        columnId: string;
      }>
    ) {
      const { id, suspended, columnId } = action.payload;
      const insertIndex = suspended === true ? state.ids.length - 1 : 0;
      const categories = Object.values(state.entities).filter(
        (cat) => cat && cat.id !== id && cat.columnId === columnId
      ) as ICategory[];
      categories
        .sort((a, b) => Number(a.suspended) - Number(b.suspended))
        .splice(insertIndex, 0, { ...state.entities[id] } as ICategory);
      const categoriesToUpdate = categories.map((cat, idx) => {
        if (cat.id === id) {
          return { ...cat, suspended, order: idx + 1 };
        } else {
          return { ...cat, order: idx + 1 };
        }
      });
      categoriesAdapter.upsertMany(state, categoriesToUpdate);
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
    sortCategoriesOnDragEnd(
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        prevColId: string;
        newColId?: string;
      }>
    ) {
      const { activeId, overId, prevColId, newColId } = action.payload;
      if (!newColId) {
        /* remains in same column */
        const idList = Object.values(state.entities)
          .filter((cat) => cat?.columnId === prevColId)
          .sort((a, b) => Number(a?.order) - Number(b?.order))
          .map((cat) => cat?.id);
        const oldIdx = idList.indexOf(activeId);
        const newIdx = idList.indexOf(overId);
        const sortedIds = arrayMove(idList, oldIdx, newIdx);
        const catsToUpdate = sortedIds.map((id, idx) => ({
          ...state.entities[id as string],
          order: idx + 1,
        })) as ICategory[];
        categoriesAdapter.upsertMany(state, catsToUpdate);
      } else if (overId === newColId) {
        /* dragged over new column */
        const newColIdList = Object.values(state.entities)
          .filter((cat) => cat?.columnId === newColId)
          .sort((a, b) => Number(a?.order) - Number(b?.order))
          .map((cat) => cat?.id);

        newColIdList.push(activeId);
        const catsToUpdate = newColIdList.map((id, idx) => {
          if (id === activeId) {
            return {
              ...state.entities[id as string],
              columnId: newColId,
              order: idx + 1,
            };
          } else {
            return {
              ...state.entities[id as string],
              order: idx + 1,
            };
          }
        }) as ICategory[];
        categoriesAdapter.upsertMany(state, catsToUpdate);
      } else {
        /* dragged over another category */
        const overCatPosition = Number(state.entities[overId]?.order);
        const newColIdList = Object.values(state.entities)
          .filter((cat) => cat?.columnId === newColId)
          .sort((a, b) => Number(a?.order) - Number(b?.order))
          .map((cat) => cat?.id)
          .concat(activeId) as string[];

        const sortedCats = arrayMove(
          newColIdList,
          newColIdList.length - 1,
          overCatPosition - 1
        );

        const catsToUpdate = sortedCats.map((id, idx) => {
          if (id === activeId) {
            return {
              ...state.entities[id],
              columnId: newColId,
              order: idx + 1,
            };
          } else {
            return {
              ...state.entities[id],
              order: idx + 1,
            };
          }
        }) as ICategory[];
        categoriesAdapter.upsertMany(state, catsToUpdate);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearColumn, (state, action) => {
        const { id } = action.payload;
        const categoriesToDelete = Object.values(state.entities)
          .filter((cat) => cat?.columnId === id)
          .map((cat) => cat?.id) as string[];
        categoriesAdapter.removeMany(state, categoriesToDelete);
      })
      .addCase(sortFeaturesOnDragEnd, (state, action) => {
        const { activeId, prevCatId, newCatId } = action.payload;
        if (newCatId) {
          state.entities[prevCatId]?.features.filter((id) => id !== activeId);
          state.entities[newCatId]?.features.unshift(activeId);
        }
      })
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

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  toggleCategorySuspended,
  sortCategoriesOnDragEnd,
  copyCategoriesFromColumn,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const { selectById: getCategoryById } =
  categoriesAdapter.getSelectors<RootState>((state) => state.categories);

export const getSortedCategoriesByColumn = (
  state: RootState,
  columnId: string
) => {
  return Object.values(state.categories.entities)
    .filter((cat) => cat?.columnId === columnId)
    .sort((a, b) => Number(a?.order) - Number(b?.order))
    .map((cat) => cat?.id) as string[];
};
