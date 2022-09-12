import { configureStore, combineReducers } from "@reduxjs/toolkit";
import projectsSlice from "./projects";
import columnsSlice from "./columns";
import categoriesSlice from "./categories";
import featuresSlice from "./features";
import taskSlice from "./tasks";
import sessionSlice from "./session";
import listener from "./listener";

const rootReducer = combineReducers({
  session: sessionSlice,
  projects: projectsSlice,
  columns: columnsSlice,
  categories: categoriesSlice,
  features: featuresSlice,
  tasks: taskSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (middleware) => middleware().prepend(listener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
