import React from "react";
import store from "../store";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  sortableKeyboardCoordinates,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToHorizontalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { sortColumnsOnDragEnd } from "../store/columns"; // re-export from store/actions
import { sortCategoriesOnDragEnd } from "../store/actions";

type Props = {
  colIds: string[];
  children: React.ReactNode;
};

export default function ColumnDndContext({ colIds, children }: Props) {
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (
      over &&
      active.data.current &&
      active.data.current["type"] === "category"
    ) {
      console.log("A category is being moved!", active.id);
      const activeCategory = store.getState().categories.entities[active.id];

      const overCategory = store.getState().categories.entities[over.id];

      console.log(
        "Categories match",
        activeCategory?.columnId === overCategory?.columnId
      );

      if (activeCategory?.columnId === overCategory?.columnId) {
        dispatch(
          sortCategoriesOnDragEnd({
            activeId: active.id as string,
            overId: over.id as string,
            prevColId: activeCategory?.columnId as string,
          })
        );
      }
    }
    if (over && active.id !== over.id) {
      dispatch(
        sortColumnsOnDragEnd({
          activeId: active.id as string,
          overId: over.id as string,
          idList: colIds,
        })
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      //modifiers={[restrictToFirstScrollableAncestor]}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <SortableContext items={colIds} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
