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
} from "./actions";

const listener = createListenerMiddleware();

type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = listener.startListening as AppStartListening;

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

export default listener;
