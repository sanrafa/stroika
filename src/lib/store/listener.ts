import type { RootState, AppDispatch } from "./index";
import {
  createListenerMiddleware,
  isAnyOf,
  addListener,
} from "@reduxjs/toolkit";
import type { TypedStartListening, TypedAddListener } from "@reduxjs/toolkit";
import {
  updateProject,
  addCategory,
  addColumn,
  addFeature,
  addTask,
  deleteColumn,
  deleteCategory,
  deleteFeature,
  deleteTask,
  updateColumn,
  updateCategory,
  updateFeature,
  updateTask,
  updateManyTasks,
  toggleTaskComplete,
  sortCategoriesOnDragEnd,
  sortFeaturesOnDragEnd,
  copyCategoriesFromColumn,
} from "./actions";
import { getSortedCategoriesByColumn } from "./categories";

const listener = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listener.startListening as AppStartListening;

export const addAppListener = addListener as TypedAddListener<
  RootState,
  AppDispatch
>;

// Update project.updatedAt whenever a change is dispatch
startAppListening({
  matcher: isAnyOf(
    addCategory,
    addColumn,
    addFeature,
    addTask,
    deleteColumn,
    deleteCategory,
    deleteFeature,
    deleteTask,
    updateColumn,
    updateCategory,
    updateManyTasks,
    updateTask,
    sortCategoriesOnDragEnd,
    sortFeaturesOnDragEnd,
    copyCategoriesFromColumn
  ),
  effect: async (action, listenerApi) => {
    const id = listenerApi.getState().session.currentProjectId;
    if (id)
      listenerApi.dispatch(
        updateProject({ id, changes: { updatedAt: Date() } })
      );
  },
});

// When categories are copied from one column to another, add ids to new column
startAppListening({
  actionCreator: copyCategoriesFromColumn,
  effect: (action, listenerApi) => {
    const { toId } = action.payload;
    const columnCategories = getSortedCategoriesByColumn(
      listenerApi.getState(),
      toId
    );
    listenerApi.dispatch(
      updateColumn({
        id: toId,
        changes: {
          categories: columnCategories,
        },
      })
    );
  },
});

// When a task is toggled complete, calculate whether that feature's status should be updated
startAppListening({
  actionCreator: toggleTaskComplete,
  effect: (action, listenerApi) => {
    const { featureId } = action.payload;
    const feature = listenerApi.getState().features.entities[featureId];
    const featureTasks = Object.values(
      listenerApi.getState().tasks.entities
    ).filter((task) => task?.featureId === featureId);
    const completedTasks = featureTasks.filter(
      (task) => task?.completed === true
    );
    if (
      featureTasks.length === completedTasks.length &&
      featureTasks.length > 0
    ) {
      listenerApi.dispatch(
        updateFeature({ id: featureId, changes: { completed: true } })
      );
    } else if (feature?.completed === false) {
      return;
    } else {
      listenerApi.dispatch(
        updateFeature({ id: featureId, changes: { completed: false } })
      );
    }
  },
});

export default listener;
