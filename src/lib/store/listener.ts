import type { RootState, AppDispatch } from "./index";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
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
  toggleTaskComplete,
} from "./actions";

const listener = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listener.startListening as AppStartListening;

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
    updateFeature,
    updateTask
  ),
  effect: async (action, listenerApi) => {
    const id = listenerApi.getState().session.currentProjectId;
    if (id)
      listenerApi.dispatch(
        updateProject({ id, changes: { updatedAt: Date() } })
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
