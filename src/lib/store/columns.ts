import { IColumn } from "../types";
import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { addCategory, deleteCategory, deleteProject } from "./actions";
import { arrayMove } from "@dnd-kit/sortable";

export const generateDefaultColumns = (projectId: string): IColumn[] => {
  return [
    {
      id: nanoid(5),
      name: "PLANNING",
      order: 1,
      projectId,
      categories: [],
    },
    {
      id: nanoid(5),
      name: "IN PROGRESS",
      order: 2,
      projectId,
      categories: [],
    },
    {
      id: nanoid(5),
      name: "READY FOR REVIEW",
      order: 3,
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
      const columnsToUpdate = Object.values(state.entities).map((col, idx) => ({
        ...col,
        order: idx + 1,
      }));
      columnsToUpdate.push({
        id: action.payload.id,
        name: action.payload.name,
        order: state.ids.length + 1,
        projectId: action.payload.projectId,
        categories: [],
      });
      columnsAdapter.upsertMany(state, columnsToUpdate as IColumn[]);
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
    sortColumnsOnDragEnd(
      state,
      action: PayloadAction<{
        activeId: string;
        overId: string;
        idList: string[];
      }>
    ) {
      const { activeId, overId, idList } = action.payload;
      const oldIdx = idList.indexOf(activeId);
      const newIdx = idList.indexOf(overId);
      const sortedIds = arrayMove(idList, oldIdx, newIdx);
      const colsToUpdate = sortedIds.map((id, idx) => ({
        ...state.entities[id],
        order: idx + 1,
      })) as IColumn[];
      columnsAdapter.upsertMany(state, colsToUpdate);
    },
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
        state.entities[columnId]?.categories.unshift(id);
      })
      .addCase(deleteCategory, (state, action) => {
        const { id, columnId } = action.payload;
        const filtered = state.entities[columnId]?.categories.filter(
          (cat) => cat !== id
        ) as string[];
        columnsAdapter.updateOne(state, {
          id: columnId,
          changes: {
            categories: filtered,
          },
        });
      });
  },
});

export const {
  addColumn,
  updateColumn,
  deleteColumn,
  addManyColumns,
  sortColumnsOnDragEnd,
} = columnsSlice.actions;

export default columnsSlice.reducer;

export const { selectById: getColumnById } =
  columnsAdapter.getSelectors<RootState>((state) => state.columns);

export const getSortedColumnIdsByProject = (
  state: RootState,
  projectId: string
) => {
  return Object.values(state.columns.entities)
    .filter((col) => col?.projectId === projectId)
    .sort((a, b) => Number(a?.order) - Number(b?.order))
    .map((col) => col?.id);
};
