import { IColumn } from "../types";
import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export const generateDefaultColumns = (projectId: string): IColumn[] => {
  return [
    {
      id: nanoid(5),
      name: "TO DO",
      order: 0,
      projectId,
      categories: [],
    },
    {
      id: nanoid(5),
      name: "DOING",
      order: 1,
      projectId,
      categories: [],
    },
    {
      id: nanoid(5),
      name: "DONE",
      order: 2,
      projectId,
      categories: [],
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
    addColumn(
      state,
      action: PayloadAction<{
        id: string;
        projectId: string;
        name: string;
      }>
    ) {
      columnsAdapter.addOne(state, {
        id: action.payload.id,
        name: action.payload.name,
        order: state.ids.length + 1,
        projectId: action.payload.projectId,
        categories: [],
      });
    },
    updateColumn: columnsAdapter.updateOne,
    deleteColumn(
      state,
      action: PayloadAction<{
        id: string;
        projectId: string;
      }>
    ) {
      columnsAdapter.removeOne(state, action.payload.id);
    },
    addManyColumns: columnsAdapter.addMany,
  },
});

export const { addColumn, updateColumn, deleteColumn, addManyColumns } =
  columnsSlice.actions;

export default columnsSlice.reducer;

export const { selectById: getColumnById } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);
