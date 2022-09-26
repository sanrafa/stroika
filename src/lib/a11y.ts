import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import memoize from "proxy-memoize";
import store, { RootState } from "../lib/store";
import { getTasksByFeature } from "./store/tasks";

export const taskInstructions = `To sort a task by dragging, press space or enter on the drag handle.
  While dragging, use the up and down arrow keys to move the item vertically.
  Press space or enter again to drop the task in its new position, or press escape to cancel.`;

export const taskAnnouncements = {
  onDragStart({ active }: DragStartEvent) {
    const description = active.data.current?.description;
    const position = active.data.current?.order;

    return `Picked up task ${description} in position ${position}.`;
  },
  onDragOver({ active, over }: DragOverEvent) {
    const activeDesc = active.data.current?.description;
    const featureId = active.data.current?.featureId;
    const tasksLength = memoize(
      (state: RootState) => getTasksByFeature(state, featureId).length
    );
    if (over) {
      const overPos = over.data.current?.order;

      return `Task ${activeDesc} was moved into position ${overPos} of ${tasksLength(
        store.getState()
      )}.`;
    }
  },
  onDragEnd({ active, over }: DragEndEvent) {
    const activeDesc = active.data.current?.description;
    const activePos = active.data.current?.order;
    const featureId = active.data.current?.featureId;
    const tasksLength = memoize(
      (state: RootState) => getTasksByFeature(state, featureId).length
    );
    if (over) {
      const overPos = over.data.current?.order;

      return `${activeDesc} was moved from position ${activePos} to ${overPos} of ${tasksLength(
        store.getState()
      )}`;
    }
  },
  onDragCancel({ active }: DragCancelEvent) {
    const activeDesc = active.data.current?.description;
    return `Sorting was cancelled. Task ${activeDesc} was dropped.`;
  },
};

export const columnInstructions = `To pick up a draggable item, press space or enter while focused on its drag handle.
While dragging, use the arrow keys to move the item in a given direction. Columns can only be moved horizontally.
Press space or enter a second time to drop the item in its new position, or press escape to cancel.
Note that tasks are archived when their ancestors are moved horizontally, unless changed in the project settings above.`;

export const columnAnnouncements = {
  onDragStart({ active }: DragStartEvent) {
    const type = active.data.current?.type;
    const name = active.data.current?.name;
    return `Picked up draggable ${type} ${name}.`;
  },
  onDragOver({ active, over }: DragOverEvent) {
    const activeType = active.data.current?.type;
    const activeName = active.data.current?.name;
    if (over) {
      const overType = over.data.current?.type;
      const overName = over.data.current?.name;

      return `${activeType} ${activeName} was moved over ${overType} ${overName}.`;
    }
    return `${activeType} ${activeName} is no longer over a droppable area.`;
  },
  onDragEnd({ active, over }: DragEndEvent) {
    const activeType = active.data.current?.type;
    const activeName = active.data.current?.name;
    if (over) {
      const overType = over.data.current?.type;
      const overName = over.data.current?.name;

      return `${activeType} ${activeName} was dropped over ${overType} ${overName}`;
    }
    return `${activeType} ${activeName} was dropped.`;
  },
  onDragCancel({ active }: DragCancelEvent) {
    const activeType = active.data.current?.type;
    const activeName = active.data.current?.name;
    return `Dragging was cancelled. ${activeType} ${activeName} was dropped.`;
  },
};
