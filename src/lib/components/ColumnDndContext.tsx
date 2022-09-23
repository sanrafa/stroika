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
    const { active, over } = event;
    const activeId = activeComponent.id,
      activeType = activeComponent.type,
      activeParent = activeComponent.parentId,
      overId = over?.id as string,
      overType = over?.data.current?.type;

    // no action needed if column is active
    if (activeType === "column") return;

    console.log("active type:", activeType);
    console.log("over type", overType);

    // if category dragged over empty column, add it to that column
    if (overType === "column") {
      dispatch(
        sortCategoriesOnDragEnd({
          activeId,
          overId,
          prevColId: activeParent,
          newColId: overId,
        })
      );
    }

    //if category dragged over another in same column, no action needed
    /* 
      if over and active type both category - fetch data, compare columnIds
      if same: return, sort handled on drag end
      if different: dispatch updateParentColumn action, column store extrareducer updates children. sort should be handled on drag end
    */

    // if category is dragged to non-empty column, it will be "over" a category in that column
    // if that category is last in the column, push active to the end
    // otherwise, sort it into categories in appropriate order
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
