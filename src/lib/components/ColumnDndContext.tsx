import React from "react";
import store from "../store";

import { ColumnOverlay, CategoryOverlay } from "./overlays";

import {
  DndContext,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";

import {
  sortableKeyboardCoordinates,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { restrictToParentElement } from "@dnd-kit/modifiers";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  sortCategoriesOnDragEnd,
  sortColumnsOnDragEnd,
} from "../store/actions";

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

  // this tracks which component is being dragged, for rendering overlay
  const [activeComponent, setActiveComponent] = React.useState<{
    id: string;
    type: string;
  }>({ id: "", type: "" });

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const id = active.id as string;
    const type = active.data.current?.type as string;

    setActiveComponent({ id, type });
  }

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

      console.log("ACTIVE:");

      console.table(activeCategory);

      console.log("OVER:");

      console.table(overCategory);

      const columnsMatch = activeCategory?.columnId === overCategory?.columnId;

      console.log("Columns match", columnsMatch);

      if (columnsMatch) {
        if (over && active.id !== over.id) {
          dispatch(
            sortCategoriesOnDragEnd({
              activeId: active.id as string,
              overId: over.id as string,
              prevColId: activeCategory?.columnId as string,
            })
          );
        }
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
    setActiveComponent({ id: "", type: "" });
    return;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToParentElement]}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
    >
      <SortableContext items={colIds} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay>
        {/* using a switch statement for render requires self-invoking function */}
        {(function () {
          switch (activeComponent.type) {
            case "column":
              return <ColumnOverlay id={activeComponent.id} />;
            case "category":
              return <CategoryOverlay id={activeComponent.id} />;
            default:
              null;
          }
        })()}
      </DragOverlay>
    </DndContext>
  );
}
