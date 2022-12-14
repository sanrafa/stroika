import React from "react";
import { debounce } from "lodash";

import { ColumnOverlay, CategoryOverlay, FeatureOverlay } from "./overlays";

import {
  DndContext,
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

import { columnInstructions, columnAnnouncements } from "../a11y";

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

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (over) {
      const activeId = activeComponent.id,
        activeType = activeComponent.type,
        activeParent = active.data.current?.parentId as string,
        activeParentColumn = active.data.current?.columnId as string,
        overId = over?.id as string,
        overType = over?.data.current?.type,
        overParent = over?.data.current?.parentId,
        overParentColumn = over?.data.current?.columnId as string;

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
          if (overType === "feature" && overParent !== activeParent) {
            dispatch(
              sortFeaturesOnDragEnd({
                activeId,
                overId,
                prevCatId: activeParent,
                newCatId: overParent,
                prevColId: activeParentColumn,
                newColId: overParentColumn,
              })
            );
          }
          if (overType === "category" && overId !== activeParent) {
            dispatch(
              sortFeaturesOnDragEnd({
                activeId,
                overId,
                prevCatId: activeParent,
                newCatId: overId,
                prevColId: activeParentColumn,
                newColId: overParentColumn,
              })
            );
          }
          break;
        default:
          break;
      }
    }
  }

  const debouncedDragOver = debounce(
    (event: DragOverEvent) => handleDragOver(event),
    100
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over) {
      const overType = over.data.current?.type;
      const overParent = over.data.current?.parentId;
      const activeParent = active.data.current?.parentId;

      switch (activeComponent.type) {
        case "category":
          const activeColumn = active.data.current?.columnId as string;
          const overColumn = over.data.current?.columnId as string;
          const columnsMatch = activeColumn === overColumn;
          if (columnsMatch && active.id !== over.id) {
            return dispatch(
              sortCategoriesOnDragEnd({
                activeId: active.id as string,
                overId: over.id as string,
                prevColId: activeColumn,
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
          if (overType === "feature" && overParent === activeParent) {
            return dispatch(
              sortFeaturesOnDragEnd({
                activeId: activeComponent.id,
                overId: over.id as string,
                prevCatId: activeParent,
              })
            );
          }

          break;
        default:
          break;
      }
    }

    setActiveComponent({ id: "", type: "" });
    return;
  }

  return (
    <DndContext
      sensors={sensors}
      accessibility={{
        announcements: columnAnnouncements,
        screenReaderInstructions: {
          draggable: columnInstructions,
        },
      }}
      modifiers={
        activeComponent.type === "column"
          ? [restrictToParentElement, restrictToHorizontalAxis]
          : []
      }
      onDragStart={handleDragStart}
      onDragOver={debouncedDragOver}
      onDragEnd={handleDragEnd}
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
