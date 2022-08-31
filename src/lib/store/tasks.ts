import { ITask } from "../types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const tasksAdapter = createEntityAdapter<ITask>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = tasksAdapter.getInitialState();

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: tasksAdapter.addOne,
    updateTask: tasksAdapter.updateOne,
    deleteTask: tasksAdapter.removeOne,
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;

export const { selectById: getTaskById } = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);
