import { configureStore } from "@reduxjs/toolkit";
import projectsSlice from "./projects";
import columnsSlice from "./columns";
import categoriesSlice from "./categories";
import featuresSlice from "./features";
import taskSlice from "./tasks";

const store = configureStore({
  reducer: {
    projects: projectsSlice,
    columns: columnsSlice,
    categories: categoriesSlice,
    features: featuresSlice,
    tasks: taskSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
