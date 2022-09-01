import { IColumn } from "../types";
import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { addProject, updateProject } from "./projects";

export const generateDefaultColumns = (projectId: string): IColumn[] => {
  return [
    {
      id: nanoid(5),
      name: "TO DO",
      order: 0,
      projectId,
    },
    {
      id: nanoid(5),
      name: "DOING",
      order: 1,
      projectId,
    },
    {
      id: nanoid(5),
      name: "DONE",
      order: 2,
      projectId,
    },
  ];
};

const columnsAdapter = createEntityAdapter<IColumn>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = columnsAdapter.getInitialState();

const columnsSlice = createSlice({
  name: "columns",
  initialState,
  reducers: {
    addColumn: columnsAdapter.addOne,
    updateColumn: columnsAdapter.updateOne,
    deleteColumn: columnsAdapter.removeOne,
    addManyColumns: columnsAdapter.addMany,
  },
});

export const { addColumn, updateColumn, deleteColumn, addManyColumns } =
  columnsSlice.actions;

export default columnsSlice.reducer;

export const { selectById: getColumnById } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);
