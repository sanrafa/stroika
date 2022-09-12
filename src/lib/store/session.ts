import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

type SessionData = {
  user: null | string;
  currentProjectId: null | string;
};

const initialState: SessionData = {
  user: null,
  currentProjectId: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: string | null }>) {
      state.user = action.payload.user;
    },
    setCurrentProject(state, action: PayloadAction<{ id: string | null }>) {
      state.currentProjectId = action.payload.id;
    },
  },
});

export const { setUser, setCurrentProject } = sessionSlice.actions;

export const selectCurrentUser = (state: RootState) => state.session.user;
export const selectCurrentProjectId = (state: RootState) =>
  state.session.currentProjectId;

export default sessionSlice.reducer;
