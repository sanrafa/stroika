import { Checkbox, CheckboxIndicator } from "./index";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CrossCircledIcon as CloseIcon,
  Pencil1Icon as EditIcon,
  CircleBackslashIcon as DeleteIcon,
} from "@radix-ui/react-icons";
import React from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  addTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
} from "../store/actions";
import { getTaskById, getTasksWithIds } from "../store/tasks";
import { getFeatureById } from "../store/features";

type TaskViewProps = {
  featureId: string;
  children: React.ReactNode;
};

type TaskProps = {
  id: string;
};

const Task = ({ id }: TaskProps) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => getTaskById(state, id));
  const [completed, setCompleted] = React.useState(Boolean(task?.completed));

  const [isEditing, setIsEditing] = React.useState(false);
  const [desc, setDesc] = React.useState(task?.description);

  return (
    <li
      className={`flex space-x-2 px-4 py-1 rounded-md hover:bg-slate-700 ${
        completed ? "opacity-60" : null
      }`}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(e) => {
          dispatch(toggleTaskComplete({ id, completed: !completed }));
          setCompleted(!completed);
        }}
        className="bg-categoryToggleUnchecked w-5 h-5 flex flex-shrink-0 justify-center items-center self-center shadow-inset rounded"
      >
        <CheckboxIndicator>
          <div className="bg-categoryToggleChecked w-5 h-5 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm"></div>
        </CheckboxIndicator>
      </Checkbox>

      {isEditing ? (
        <form
          className="self-baseline"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(updateTask({ id, changes: { description: desc } }));
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
          />
          <button type="submit" className="hidden"></button>
        </form>
      ) : (
        <span className="self-baseline text-center w-4/5">
          {task?.description}
        </span>
      )}

      {!completed ? (
        <>
          <button
            type="button"
            className="text-feature rounded-full px-2 hover:text-categoryToggleUnchecked hover:bg-slate-600"
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className="text-red-500 px-2 rounded-full hover:text-red-600 hover:bg-slate-600"
            onClick={() =>
              dispatch(deleteTask({ id, featureId: task?.featureId as string }))
            }
            disabled={isEditing}
          >
            <DeleteIcon />
          </button>
        </>
      ) : null}
    </li>
  );
};

const TaskList = ({ taskIds }: { taskIds: string[] }) => {
  const tasks = useAppSelector((state) => getTasksWithIds(state, taskIds));
  return (
    <ul className="space-y-1 flex flex-col min-w-[75%] overflow-y-auto hide-scroll">
      {tasks
        .sort((a, b) => Number(a?.order) - Number(b?.order))

        .map((task) => (
          <Task id={task?.id as string} key={task?.id as string} />
        ))}
    </ul>
  );
};

export default function TaskView({ children, featureId }: TaskViewProps) {
  const dispatch = useAppDispatch();
  const feature = useAppSelector((state) => getFeatureById(state, featureId));

  const [desc, setDesc] = React.useState("");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content asChild>
          <aside className="bg-black text-compText fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[85vh] flex flex-col items-center p-4 pb-8 border-2 border-taskView rounded-md shadow-taskView space-y-2 font-manrope">
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
                <h1 className="px-4">{feature?.name}</h1>
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
                className="bg-slate-500 text-center rounded-l-md p-0.5 focus:bg-white mb-2"
                placeholder="Add a new task"
              />
              <button
                type="submit"
                className="bg-green-400 px-1 py-0.5 font-bold rounded-r-md hover:bg-green-600 hover:text-green-900"
              >
                ADD
              </button>
            </form>
            <TaskList taskIds={feature?.tasks as string[]} />
          </aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
