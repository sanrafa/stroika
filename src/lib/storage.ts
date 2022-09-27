import { RootState } from "./store";

const KEY = "store";
export function loadState() {
  try {
    const state = localStorage.getItem(KEY);
    if (!state) return undefined;
    return JSON.parse(state);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function saveState(state: RootState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
  } catch (err) {
    console.error(err);
  }
}
