import { ITask } from "../types";
import {
  createEntityAdapter,
  createSlice,
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
      const insertOrder = completed === true ? state.ids.length - 1 : 0; // if marking complete, insert at bottom, if unmarking, move to top
      const tasks = Object.values(state.entities).filter(
        (task) => task && task.id !== action.payload.id
      ) as ITask[];
      tasks
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .splice(insertOrder, 0, {
          ...state.entities[id],
        } as ITask);
      const tasksToUpdate = tasks.map((task, idx) => {
        if (task.id === id) {
          return { ...task, completed, order: idx + 1 };
        }
        return { ...task, order: idx + 1 };
      });
      console.log(tasksToUpdate);
      tasksAdapter.upsertMany(state, tasksToUpdate);
      console.log("Changing ID:", id, "To state:", completed);
    },
    updateTask: tasksAdapter.updateOne,
    deleteTask: tasksAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(toggleTaskComplete, (state, action) => {});
  },
});

export const { addTask, updateTask, deleteTask, toggleTaskComplete } =
  tasksSlice.actions;

export default tasksSlice.reducer;

export const { selectById: getTaskById } = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);
