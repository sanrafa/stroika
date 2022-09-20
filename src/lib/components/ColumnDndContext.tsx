import React from "react";

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
import { sortColumnsOnDragEnd } from "../store/columns";

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

  function handleDragEnd(event: DragEndEvent, ids: string[]) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      dispatch(
        sortColumnsOnDragEnd({
          activeId: active.id as string,
          overId: over.id as string,
          idList: ids,
        })
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis, restrictToFirstScrollableAncestor]}
      onDragEnd={(e) => handleDragEnd(e, colIds)}
    >
      <SortableContext items={colIds} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
