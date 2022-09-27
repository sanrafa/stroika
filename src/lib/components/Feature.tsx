import { TaskView, Tooltip } from "./index";
import React from "react";

import {
  CheckCircledIcon as CheckIcon,
  ListBulletIcon as TasksIcon,
  Cross1Icon as DeleteIcon,
  DragHandleDots1Icon as DragIcon,
} from "@radix-ui/react-icons";

import { useAppDispatch, useProxySelector } from "../store/hooks";
import { updateFeature, deleteFeature } from "../store/actions";
import { getFeatureById } from "../store/features";
import { getTasksByFeature } from "../store/tasks";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type FeatureProps = {
  id: string;
};

export default function Feature({ id }: FeatureProps) {
  const dispatch = useAppDispatch();

  const feature = useProxySelector((state) => getFeatureById(state, id), [id]);
  const tasks = useProxySelector((state) => getTasksByFeature(state, id), [id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({
    id,
    data: {
      type: "feature",
      name: feature?.name,
      parentId: feature?.categoryId,
      columnId: feature?.columnId,
    },
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [name, setName] = React.useState(feature?.name);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    dispatch(
      updateFeature({
        id: id,
        changes: {
          name: name?.trim(),
        },
      })
    );
    setName(name?.trim());
  };

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className="flex justify-around items-center bg-feature leading-none p-2 rounded shadow-md"
    >
      {/* Task progress indicator OR checkmark if all complete */}
      <div className="text-xxs">
        {!tasks.length ? (
          <span className="text-compText font-bold">
            NO <br /> TASKS
          </span>
        ) : tasks.every((task) => task?.completed === true) ? (
          <CheckIcon width={25} height={25} stroke="green" className="ml-1" />
        ) : (
          <span className="text-blue-100">
            {/* TODO: use a selector that returns boolean if all attached tasks are complete */}
            <span className="text-sm text-compText font-bold">
              {`${tasks.filter((task) => task?.completed === true).length} / ${
                tasks.length
              }`}
            </span>
            <br /> tasks <br /> complete
          </span>
        )}
      </div>

      <button
        className="text-slate-500 hover:text-compText cursor-grab"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-roledescription="feature drag handle"
      >
        <DragIcon width={24} height={24} />
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
          menuButtonRef?.current?.focus();
        }}
      >
        <input
          type="text"
          aria-label="feature name"
          value={name}
          className="text-center bg-feature text-compText focus:text-black focus:bg-compText focus:cursor-text cursor-pointer w-10/12 lg:w-full rounded-sm"
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSubmit}
        />
        <button
          type="submit"
          className="hidden"
          aria-label="update feature name"
        ></button>
      </form>

      <div className="flex items-center">
        <button
          aria-label="delete feature"
          type="button"
          className="p-0.5 hover:text-red-600 text-red-700 hover:bg-red-900 focus:bg-red-900 focus:text-red-600 border border-solid border-red-600 rounded-sm"
          onClick={() =>
            dispatch(
              deleteFeature({ id, categoryId: feature?.categoryId as string })
            )
          }
        >
          <Tooltip content="Delete Feature" side="bottom" align="center">
            <DeleteIcon />
          </Tooltip>
        </button>
        {/* Wrap with TaskView component to serve as trigger */}
        <TaskView featureId={id as string}>
          <button
            aria-label="view related tasks"
            ref={menuButtonRef}
            type="button"
            className="self-start p-0.5 ml-2 mr-1 border border-solid border-white rounded-sm bg-category hover:bg-categoryToggleUnchecked focus:bg-categoryToggleUnchecked"
          >
            <Tooltip content="View Tasks" side="bottom" align="center">
              <TasksIcon />
            </Tooltip>
          </button>
        </TaskView>
      </div>
    </div>
  );
}
