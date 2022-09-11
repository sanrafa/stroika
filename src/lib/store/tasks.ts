import { ITask } from "../types";
import {
  createEntityAdapter,
  createSlice,
  nanoid,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";

const tasksAdapter = createEntityAdapter<ITask>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = tasksAdapter.getInitialState();

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(
      state,
      action: PayloadAction<{
        id: string;
        description: string;
        featureId: string;
        categoryId: string;
        columnId: string;
        projectId: string;
      }>
    ) {
      const { id, description, featureId, categoryId, columnId, projectId } =
        action.payload;

      const toUpdate = Object.values(state.entities).map((task) => ({
        ...task,
        order: (task?.order as number) + 1,
      })) as ITask[];
      if (toUpdate.length > 0) tasksAdapter.upsertMany(state, toUpdate);

      tasksAdapter.addOne(state, {
        id,
        description,
        completed: false,
        order: 1,
        featureId,
        categoryId,
        columnId,
        projectId,
      });
    },
    toggleTaskComplete(
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) {
      const { id, completed } = action.payload;
      console.log("Changing ID:", id, "To state:", completed);
      tasksAdapter.updateOne(state, {
        id,
        changes: {
          order: state.ids.length,
          completed,
        },
      });
    },
    updateTask: tasksAdapter.updateOne,
    deleteTask: tasksAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(toggleTaskComplete, (state, action) => {
      const tasks = Object.values(state.entities) as ITask[];
      const tasksToUpdate = tasks
        .filter((task) => task.id !== action.payload.id)
        .map((task) => {
          if (task.order > 1) {
            return { ...task, order: task.order - 1 };
          }
        }) as ITask[];
      tasksAdapter.upsertMany(state, tasksToUpdate);
    });
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskComplete } =
  tasksSlice.actions;

export default tasksSlice.reducer;

export const { selectById: getTaskById } = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);
