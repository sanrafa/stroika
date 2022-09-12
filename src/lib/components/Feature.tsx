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

      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(
              updateFeature({
                id: id,
                changes: {
                  name: name,
                },
              })
            );
            setIsEditing(false);
          }}
        >
          <input
            type="text"
            autoFocus
            value={name}
            className="text-black text-center"
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="hidden"></button>
        </form>
      ) : (
        <h4
          className="p-0.5 ml-1 cursor-pointer"
          tabIndex={0}
          onClick={() => setIsEditing(true)}
          onKeyUp={(e) => {
            if (e.key == "Enter") setIsEditing(true);
          }}
        >
          {feature?.name}
        </h4>
      )}
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
