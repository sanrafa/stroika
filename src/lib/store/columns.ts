import { IColumn } from "../types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";

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
  },
});

export const { addColumn, updateColumn, deleteColumn } = columnsSlice.actions;

export default columnsSlice.reducer;

export const { selectById: getColumnById } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);
