import { IColumn } from "../types";
import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { addCategory, deleteCategory, deleteProject } from "./actions";

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
  extraReducers: (builder) => {
    builder
      .addCase(deleteProject, (state, action) => {
        const id = action.payload;
        const columnsToDelete = Object.values(state.entities)
          .filter((col) => col?.projectId === id)
          .map((col) => col?.id) as string[];
        columnsAdapter.removeMany(state, columnsToDelete);
      })
      .addCase(addCategory, (state, action) => {
        const { id, columnId } = action.payload;
        state.entities[columnId]?.categories.push(id);
      })
      .addCase(deleteCategory, (state, action) => {
        const { id, columnId } = action.payload;
        const filtered = state.entities[columnId]?.categories.filter(
          (cat) => cat !== id
        );
        // @ts-ignore
        state.entities[columnId].categories = filtered;
      });
  },
});

export const { addColumn, updateColumn, deleteColumn, addManyColumns } =
  columnsSlice.actions;

export default columnsSlice.reducer;

export const { selectById: getColumnById } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);
