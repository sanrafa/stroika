import React from "react";
import store from "../store";

import { ColumnOverlay, CategoryOverlay, FeatureOverlay } from "./overlays";

import {
  DndContext,
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

import {
  restrictToParentElement,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";

import { useAppDispatch } from "../store/hooks";
import {
  sortCategoriesOnDragEnd,
  sortColumnsOnDragEnd,
  sortFeaturesOnDragEnd,
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
    columnId: string;
  }>({ id: "", type: "", parentId: "", columnId: "" });

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const id = active.id as string;
    const type = active.data.current?.type as string;
    const parentId = active.data.current?.parentId || "";
    const columnId = active.data.current?.columnId || "";

    setActiveComponent({ id, type, parentId, columnId });
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;

    if (over) {
      const activeId = activeComponent.id,
        activeType = activeComponent.type,
        activeParent = activeComponent.parentId,
        activeParentColumn = activeComponent.columnId,
        overId = over?.id as string,
        overType = over?.data.current?.type,
        overParent = over?.data.current?.parentId;

      switch (activeType) {
        case "column":
          break;
        case "category":
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
          break;
        case "feature":
          break;
        default:
          break;
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      const overType = over.data.current?.type;
      const overParent = over.data.current?.parentId;

      switch (activeComponent.type) {
        case "category":
          const activeCategory =
            store.getState().categories.entities[active.id];
          const overCategory = store.getState().categories.entities[over.id];
          const columnsMatch =
            activeCategory?.columnId === overCategory?.columnId;
          if (columnsMatch && active.id !== over.id) {
            return dispatch(
              sortCategoriesOnDragEnd({
                activeId: active.id as string,
                overId: over.id as string,
                prevColId: activeCategory?.columnId as string,
              })
            );
          }
          break;
        case "column":
          if (active.id !== over.id) {
            return dispatch(
              sortColumnsOnDragEnd({
                activeId: active.id as string,
                overId: over.id as string,
                idList: colIds,
              })
            );
          }
          break;
        case "feature":
          if (
            overType === "feature" &&
            overParent === activeComponent.parentId
          ) {
            return dispatch(
              sortFeaturesOnDragEnd({
                activeId: activeComponent.id,
                overId: over.id as string,
                prevCatId: activeComponent.parentId,
              })
            );
          }
          break;
        default:
          break;
      }
    }

    setActiveComponent({ id: "", type: "", parentId: "", columnId: "" });
    return;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={
        activeComponent.type === "column"
          ? [restrictToParentElement, restrictToHorizontalAxis]
          : []
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
            case "feature":
              return <FeatureOverlay id={activeComponent.id} />;
            default:
              null;
          }
        })()}
      </DragOverlay>
    </DndContext>
  );
}
