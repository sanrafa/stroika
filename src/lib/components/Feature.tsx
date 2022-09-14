import { ITask } from "../types";
import { TaskView } from "./index";
import React from "react";

import {
  CheckCircledIcon as CheckIcon,
  ListBulletIcon as TasksIcon,
  Cross1Icon as DeleteIcon,
} from "@radix-ui/react-icons";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateFeature, deleteFeature } from "../store/actions";
import { getFeatureById } from "../store/features";
import { getTasksByFeature } from "../store/tasks";

type FeatureProps = {
  id: string;
};

export default function Feature({ id }: FeatureProps) {
  const dispatch = useAppDispatch();

  const feature = useAppSelector((state) => getFeatureById(state, id));
  const tasks = useAppSelector((state) => getTasksByFeature(state, id));

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(feature?.name);

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
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center bg-feature leading-none p-2 rounded shadow-md">
      {/* Task progress indicator OR checkmark if all complete */}
      <div className="text-xxs mr-1">
        {!feature?.tasks.length ? (
          <span className="text-red-500">
            NO <br /> TASKS
          </span>
        ) : tasks.every((task) => task?.completed === true) ? (
          <CheckIcon width={25} height={25} stroke="green" className="ml-1" />
        ) : (
          <span className="text-blue-100">
            <span className="text-sm text-compText font-bold">
              {`${tasks.filter((task) => task?.completed === true).length} / ${
                tasks.length
              }`}
            </span>
            <br /> tasks <br /> complete
          </span>
        )}
      </div>

      <form
        onClick={() => setIsEditing(true)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          disabled={!isEditing}
          value={name}
          className="text-black text-center disabled:bg-feature disabled:text-compText disabled:cursor-pointer w-10/12 lg:w-full rounded-sm"
          ref={(input) => {
            if (input !== null) {
              input.focus();
            }
          }}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSubmit}
        />
        <button type="submit" className="hidden"></button>
      </form>

      <div className="flex items-center">
        <button
          type="button"
          className="p-0.5 hover:text-red-600 text-red-700 hover:bg-red-900 focus:bg-red-900 focus:text-red-600 border border-solid border-red-600 rounded-sm"
          onClick={() =>
            dispatch(
              deleteFeature({ id, categoryId: feature?.categoryId as string })
            )
          }
        >
          <DeleteIcon />
        </button>
        {/* Wrap with TaskView component to serve as trigger */}
        <TaskView featureId={id as string}>
          <button
            type="button"
            className="self-start p-0.5 ml-2 mr-1 border border-solid border-white rounded-sm bg-category hover:bg-categoryToggleUnchecked focus:bg-categoryToggleUnchecked"
          >
            <TasksIcon />
          </button>
        </TaskView>
      </div>
    </div>
  );
}
