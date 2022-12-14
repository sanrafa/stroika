import { Checkbox, CheckboxIndicator, TaskDndContext, Tooltip } from "./index";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CrossCircledIcon as CloseIcon,
  Pencil1Icon as EditIcon,
  CircleBackslashIcon as DeleteIcon,
  CaretSortIcon as DragIcon,
  Half1Icon as UnarchiveIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useAppDispatch, useProxySelector } from "../store/hooks";
import {
  addTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from "../store/actions";
import { getTaskById, getSortedTaskIds } from "../store/tasks";
import { getFeatureById } from "../store/features";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type TaskViewProps = {
  featureId: string;
  children: React.ReactNode;
};

type TaskProps = {
  id: string;
};

const Task = ({ id }: TaskProps) => {
  const dispatch = useAppDispatch();
  const task = useProxySelector((state) => getTaskById(state, id), [id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id: id,
    data: {
      description: task?.description,
      featureId: task?.featureId,
      order: task?.order,
    },
  });
  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [completed, setCompleted] = React.useState(Boolean(task?.completed));
  const [isEditing, setIsEditing] = React.useState(false);
  const [desc, setDesc] = React.useState(task?.description);

  return (
    <li
      className={`flex space-x-2 justify-around px-4 py-1 rounded-md ${
        task?.archived ? "hover:bg-slate-800" : "hover:bg-slate-700"
      } ${completed ? "opacity-60" : null}`}
      style={sortableStyle}
      ref={setNodeRef}
    >
      {!task?.archived ? (
        <Checkbox
          aria-label="mark task complete"
          checked={completed}
          onCheckedChange={(e) => {
            dispatch(
              toggleTaskComplete({
                id,
                completed: !completed,
                featureId: task?.featureId as string,
              })
            );
            setCompleted(!completed);
          }}
          className="bg-categoryToggleUnchecked w-5 h-5 flex flex-shrink-0 justify-center items-center self-center shadow-inset rounded"
        >
          <CheckboxIndicator>
            <div className="bg-categoryToggleChecked w-5 h-5 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm"></div>
          </CheckboxIndicator>
        </Checkbox>
      ) : null}

      {!completed ? (
        <button
          {...attributes}
          {...listeners}
          aria-label="sort task"
          aria-roledescription="task drag handle"
          ref={setActivatorNodeRef}
          className="hover:bg-slate-500 rounded cursor-grab active:cursor-grabbing"
        >
          <DragIcon width={24} height={24} />
        </button>
      ) : null}

      {isEditing ? (
        <form
          className="self-baseline"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(
              updateTask({
                id,
                changes: { description: desc, archived: false },
              })
            );
            setIsEditing(false);
          }}
        >
          <input
            tabIndex={1}
            autoFocus
            value={desc}
            type="text"
            className="text-center w-6/8 bg-slate-800 rounded mx-4"
            onChange={(e) => setDesc(e.target.value)}
            aria-label="task description"
          />
          <button
            type="submit"
            className="hidden"
            aria-label="update task description"
          ></button>
        </form>
      ) : (
        <span
          className={`self-baseline w-4/5 ${
            task?.archived ? "text-slate-500 line-through" : "text-center"
          }`}
        >
          {task?.description}
        </span>
      )}

      {!completed ? (
        <>
          <button
            aria-label="edit description"
            type="button"
            className="text-feature rounded-full px-2 hover:text-categoryToggleUnchecked hover:bg-slate-600"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          >
            <Tooltip content="Edit task" side="top" align="center">
              <EditIcon />
            </Tooltip>
          </button>

          <button
            aria-label="delete task"
            type="button"
            className="text-red-500 px-2 rounded-full hover:text-red-600 hover:bg-slate-600"
            onClick={() =>
              dispatch(deleteTask({ id, featureId: task?.featureId as string }))
            }
            disabled={isEditing}
          >
            <Tooltip content="Delete task" side="top" align="center">
              <DeleteIcon />
            </Tooltip>
          </button>
        </>
      ) : null}
      {task?.archived ? (
        <button
          aria-label="unarchive task"
          type="button"
          className="text-blue-500 px-2 rounded-full hover:text-blue-600 hover:bg-slate-600"
          onClick={() =>
            dispatch(
              updateTask({
                id,
                changes: {
                  archived: false,
                },
              })
            )
          }
        >
          <Tooltip content="Unarchive task" side="top" align="center">
            <UnarchiveIcon />
          </Tooltip>
        </button>
      ) : null}
    </li>
  );
};

type TaskListProps = {
  taskIds: string[];
  showArchived: boolean;
};

const TaskList = ({ taskIds, showArchived }: TaskListProps) => {
  const sortedIds = useProxySelector(
    (state) => getSortedTaskIds(state, taskIds, showArchived),
    [taskIds, showArchived]
  ) as string[];
  return (
    <TaskDndContext taskIds={sortedIds}>
      <ul className="space-y-1 flex flex-col min-w-[75%] overflow-y-auto hide-scroll">
        {sortedIds.map((id) => (
          <Task id={id} key={id} />
        ))}
      </ul>
    </TaskDndContext>
  );
};

export default function TaskView({ children, featureId }: TaskViewProps) {
  const dispatch = useAppDispatch();
  const feature = useProxySelector(
    (state) => getFeatureById(state, featureId),
    [featureId]
  );

  const [desc, setDesc] = React.useState("");
  const [showArchived, setShowArchived] = React.useState(false);

  function handleCheckedChange() {
    return setShowArchived(!showArchived);
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content asChild>
          <section
            aria-label="task view"
            className="bg-black text-compText fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[85vh] flex flex-col items-center p-4 pb-8 border-2 border-taskView rounded-md shadow-taskView space-y-2 font-manrope"
          >
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="self-end text-categoryToggleUnchecked hover:text-red-600 focus:text-red-600"
              >
                <CloseIcon width={32} height={32} />
              </button>
            </Dialog.Close>
            <Dialog.Title asChild>
              <header className="uppercase text-2xl tracking-wider w-full text-left flex flex-col font-josefin">
                <h1 className="px-4">{feature?.name}</h1>{" "}
                <hr className="mt-2 border-categoryToggleUnchecked border-1 w-11/12 self-center" />
              </header>
            </Dialog.Title>
            <Dialog.Description asChild>
              <p className="text-sm">Add, delete, edit, and track tasks.</p>
            </Dialog.Description>
            <form
              className="p-2 text-black"
              onSubmit={(e) => {
                e.preventDefault();
                if (feature) {
                  dispatch(
                    addTask({
                      id: nanoid(5),
                      description: desc,
                      featureId: feature?.id,
                      categoryId: feature?.categoryId,
                      columnId: feature?.columnId,
                      projectId: feature?.projectId,
                    })
                  );
                  setDesc("");
                }
              }}
            >
              <input
                type="text"
                name="task-description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-slate-300 text-center rounded-l-md p-0.5 focus:bg-white"
                placeholder="Add a new task"
              />
              <button
                type="submit"
                className="bg-green-400 px-1 py-0.5 font-bold rounded-r-md hover:bg-green-600 hover:text-green-900"
                aria-label="add task"
              >
                ADD
              </button>
            </form>
            <div className="flex space-x-4 justify-center mb-2">
              <Checkbox
                aria-label="show archived tasks"
                className="bg-slate-400 w-4 h-4 flex flex-shrink-0 justify-center items-center self-center shadow-inset rounded"
                defaultChecked={showArchived}
                onCheckedChange={handleCheckedChange}
              >
                <CheckboxIndicator>
                  <div className="bg-green-800 w-4 h-4 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm"></div>
                </CheckboxIndicator>
              </Checkbox>
              <span>Show archived tasks</span>
            </div>
            <TaskList
              taskIds={feature?.tasks as string[]}
              showArchived={showArchived}
            />
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
