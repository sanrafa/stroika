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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";

import { useAppDispatch } from "../store/hooks";
import { sortTasksOnDragEnd } from "../store/actions";

import { taskAnnouncements, taskInstructions } from "../a11y";

type Props = {
  taskIds: string[];
  children: React.ReactNode;
};

export default function TaskDndContext({ taskIds, children }: Props) {
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
        sortTasksOnDragEnd({
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
      onDragEnd={(e) => handleDragEnd(e, taskIds)}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      accessibility={{
        announcements: taskAnnouncements,
        screenReaderInstructions: {
          draggable: taskInstructions,
        },
      }}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}
