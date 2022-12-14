import { IProject } from "../types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { deleteColumn, addColumn } from "./actions";

const projectsAdapter = createEntityAdapter<IProject>({
  // if both projects have been updated, use that field. Otherwise, creation dates
  sortComparer: (a, b) =>
    a.updatedAt && b.updatedAt
      ? b.updatedAt.localeCompare(a.updatedAt)
      : b.createdAt.localeCompare(a.createdAt),
});

const initialState = projectsAdapter.getInitialState();

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: projectsAdapter.addOne,
    updateProject: projectsAdapter.updateOne,
    deleteProject: projectsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteColumn, (state, action) => {
        const { id, projectId } = action.payload;
        if (state.entities[projectId]) {
          const newColumns = state.entities[projectId]?.columns.filter(
            (colId) => colId !== id
          );
          projectsSlice.caseReducers.updateProject(state, {
            id: projectId,
            changes: { columns: newColumns, updatedAt: Date() },
          });
        }
      })
      .addCase(addColumn, (state, action) => {
        const { id, projectId } = action.payload;
        if (state.entities[projectId]) {
          const columns = state.entities[projectId]?.columns;
          columns?.push(id);
          projectsSlice.caseReducers.updateProject(state, {
            id: projectId,
            changes: { columns, updatedAt: Date() },
          });
        }
      });
  },
});

export const { addProject, updateProject, deleteProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;

export const { selectAll: getAllProjects, selectById: getProjectById } =
  projectsAdapter.getSelectors<RootState>((state) => state.projects);
