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
  DragOverEvent,
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
    parentId: string;
  }>({ id: "", type: "", parentId: "" });

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const id = active.id as string;
    const type = active.data.current?.type as string;
    const parentId = active.data.current?.parentId || "";

    setActiveComponent({ id, type, parentId });
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    const activeId = activeComponent.id,
      activeType = activeComponent.type,
      activeParent = activeComponent.parentId,
      overId = over?.id as string,
      overType = over?.data.current?.type,
      overParent = over?.data.current?.parentId;

    // no action needed if column is active
    if (activeType === "column") return;

    if (activeType === "category") {
      // if category dragged over column, add it to that column
      if (overType === "column") {
        dispatch(
          sortCategoriesOnDragEnd({
            activeId,
            overId,
            prevColId: activeParent,
            newColId: overId,
          })
        );
      } else if (overType === "category" && overId !== activeId) {
        dispatch(
          sortCategoriesOnDragEnd({
            activeId,
            overId,
            prevColId: activeParent,
            newColId: overParent,
          })
        );
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (
      over &&
      active.data.current &&
      active.data.current["type"] === "category"
    ) {
      const activeCategory = store.getState().categories.entities[active.id];

      const overCategory = store.getState().categories.entities[over.id];

      const columnsMatch = activeCategory?.columnId === overCategory?.columnId;

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
    setActiveComponent({ id: "", type: "", parentId: "" });
    return;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={
        activeComponent.type === "column" ? [restrictToParentElement] : []
      }
      onDragStart={(e) => handleDragStart(e)}
      onDragOver={(e) => handleDragOver(e)}
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
