import { ITask } from "../types";
import {
  createEntityAdapter,
  createSlice,
  EntityId,
  PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "./index";
import {
  deleteProject,
  deleteFeature,
  deleteColumn,
  deleteCategory,
  sortCategoriesOnDragEnd,
  sortFeaturesOnDragEnd,
  clearColumn,
} from "./actions";
import { arrayMove } from "@dnd-kit/sortable";

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
        archived: false,
        featureId,
        categoryId,
        columnId,
        projectId,
      });
    },
    toggleTaskComplete(
      state,
      action: PayloadAction<{
        id: string;
        featureId: string;
        completed: boolean;
      }>
    ) {
      const { id, featureId, completed } = action.payload;
      const insertOrder = completed === true ? state.ids.length - 1 : 0; // if marking complete, insert at bottom, if unmarking, move to top
      const tasks = Object.values(state.entities).filter(
        (task) => task && task.id !== id && task.featureId === featureId
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
      tasksAdapter.upsertMany(state, tasksToUpdate);
    },
    updateTask: tasksAdapter.updateOne,
    deleteTask(
      state,
      action: PayloadAction<{ id: EntityId; featureId: string }>
    ) {
      const { id } = action.payload;
      tasksAdapter.removeOne(state, id);
    },
    sortTasksOnDragEnd(
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
      const tasksToUpdate = sortedIds.map((id, idx) => {
        if (id === activeId) {
          return {
            ...state.entities[id],
            order: idx + 1,
            archived: false,
          };
        } else {
          return {
            ...state.entities[id],
            order: idx + 1,
          };
        }
      }) as ITask[];
      tasksAdapter.upsertMany(state, tasksToUpdate);
    },
    updateManyTasks: tasksAdapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearColumn, (state, action) => {
        const { id } = action.payload;
        const tasksToDelete = Object.values(state.entities)
          .filter((task) => task?.columnId === id)
          .map((task) => task?.id) as string[];
        tasksAdapter.removeMany(state, tasksToDelete);
      })
      .addCase(sortFeaturesOnDragEnd, (state, action) => {
        const { activeId, prevColId, newColId } = action.payload;
        if (newColId && newColId !== prevColId) {
          const tasksToUpdate = Object.values(state.entities)
            .filter((task) => task?.featureId === activeId)
            .map((task) => ({ ...task, columnId: newColId })) as ITask[];
          tasksAdapter.upsertMany(state, tasksToUpdate);
        }
      })
      .addCase(sortCategoriesOnDragEnd, (state, action) => {
        const { activeId, newColId, prevColId } = action.payload;
        if (newColId && newColId !== prevColId) {
          const tasksToUpdate = Object.values(state.entities)
            .filter((task) => task?.categoryId === activeId)
            .map((task) => ({ ...task, columnId: newColId })) as ITask[];
          tasksAdapter.upsertMany(state, tasksToUpdate);
        }
      })
      .addCase(deleteProject, (state, action) => {
        const id = action.payload;
        const tasksToDelete = Object.values(state.entities)
          .filter((task) => task?.projectId === id)
          .map((task) => task?.id) as string[];
        tasksAdapter.removeMany(state, tasksToDelete);
      })
      .addCase(deleteColumn, (state, action) => {
        const { id } = action.payload;
        const tasksToDelete = Object.values(state.entities)
          .filter((task) => task?.columnId === id)
          .map((task) => task?.id) as string[];
        tasksAdapter.removeMany(state, tasksToDelete);
      })
      .addCase(deleteCategory, (state, action) => {
        const { id } = action.payload;
        const tasksToDelete = Object.values(state.entities)
          .filter((task) => task?.categoryId === id)
          .map((task) => task?.id) as string[];
        tasksAdapter.removeMany(state, tasksToDelete);
      })
      .addCase(deleteFeature, (state, action) => {
        const { id } = action.payload;
        const tasksToDelete = Object.values(state.entities)
          .filter((task) => task?.featureId === id)
          .map((task) => task?.id) as string[];
        tasksAdapter.removeMany(state, tasksToDelete);
      });
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  sortTasksOnDragEnd,
  updateManyTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export const { selectById: getTaskById } = tasksAdapter.getSelectors<RootState>(
  (state) => state.tasks
);

export const getTasksByFeature = (
  state: RootState,
  featureId: string,
  archived = false
) => {
  if (!archived) {
    return Object.values(state.tasks.entities).filter(
      (task) => task?.featureId === featureId && !task.archived
    );
  } else {
    return Object.values(state.tasks.entities).filter(
      (task) => task?.featureId === featureId
    );
  }
};

export const getSortedTaskIds = (
  state: RootState,
  ids: string[],
  showArchived = false
) => {
  if (!showArchived) {
    return Object.values(state.tasks.entities)
      .filter((task) => ids.includes(task?.id as string) && !task?.archived)
      .sort((a, b) => Number(a?.order) - Number(b?.order))
      .map((task) => task?.id);
  } else {
    return Object.values(state.tasks.entities)
      .filter((task) => ids.includes(task?.id as string))
      .sort((a, b) => Number(a?.order) - Number(b?.order))
      .map((task) => task?.id);
  }
};

export const getTasksByProject = (state: RootState, projectId: string) => {
  return Object.values(state.tasks.entities).filter(
    (task) => task?.projectId === projectId
  ) as ITask[];
};

export const getPendingTasksByProject = (
  state: RootState,
  projectId: string
) => {
  return Object.values(state.tasks.entities)
    .filter(
      (task) =>
        task?.projectId === projectId && !task.completed && !task.archived
    )
    .map((task) => task?.id) as string[];
};
