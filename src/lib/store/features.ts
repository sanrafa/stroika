import { IFeature } from "../types";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./index";

const featuresAdapter = createEntityAdapter<IFeature>({
  sortComparer: (a, b) => a.order - b.order,
});

const initialState = featuresAdapter.getInitialState();

const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    addFeature: featuresAdapter.addOne,
    updateFeature: featuresAdapter.updateOne,
    deleteFeature: featuresAdapter.removeOne,
  },
});

export const { addFeature, updateFeature, deleteFeature } =
  featuresSlice.actions;

export default featuresSlice.reducer;

export const { selectById: getFeatureById } =
  featuresAdapter.getSelectors<RootState>((state) => state.features);
