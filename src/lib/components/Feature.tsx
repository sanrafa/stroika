import { ITask } from "../types";
import { TaskView } from "./index";
import React from "react";

import {
  CheckCircledIcon as CheckIcon,
  ListBulletIcon as TasksIcon,
} from "@radix-ui/react-icons";

import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateFeature } from "../store/actions";

type FeatureProps = {
  id: string;
};

export default function Feature({ id }: FeatureProps) {
  const dispatch = useAppDispatch();

  const feature = useAppSelector((state) => state.features.entities[id]);
  const tasks = useAppSelector((state) =>
    Object.values(state.tasks.entities).filter((task) =>
      feature?.tasks.includes(task?.id as string)
    )
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(feature?.name);

  return (
    <div className="flex justify-between items-center bg-feature leading-none p-2 rounded shadow-md">
      {/* Task progress indicator OR checkmark if all complete */}
      <div className="text-xxs mr-1">
        {feature?.completed ? (
          <CheckIcon width={25} height={25} stroke="green" className="ml-1" />
        ) : !feature?.tasks.length ? (
          <span className="text-red-500">
            NO <br /> TASKS
          </span>
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

      {/* Wrap with TaskView component to serve as trigger */}
      <TaskView tasks={tasks as ITask[]} featureName={feature?.name as string}>
        <button
          type="button"
          className="self-start p-0.5 ml-2 mr-1 border border-solid border-white rounded-sm bg-category hover:bg-categoryToggleUnchecked"
        >
          <TasksIcon />
        </button>
      </TaskView>
    </div>
  );
}
