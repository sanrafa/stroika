import { configureStore, combineReducers } from "@reduxjs/toolkit";
import projectsSlice from "./projects";
import columnsSlice from "./columns";
import categoriesSlice from "./categories";
import featuresSlice from "./features";
import taskSlice from "./tasks";

const rootReducer = combineReducers({
  projects: projectsSlice,
  columns: columnsSlice,
  categories: categoriesSlice,
  features: featuresSlice,
  tasks: taskSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
