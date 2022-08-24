import { ITask } from "../types";

import {
  CheckCircledIcon as CheckIcon,
  ListBulletIcon as TasksIcon,
} from "@radix-ui/react-icons";

type FeatureProps = {
  name: string;
  isComplete: boolean;
  tasks: ITask[];
};

export default function Feature({ name, isComplete, tasks }: FeatureProps) {
  return (
    <div className="flex justify-between items-center bg-feature leading-none p-2 rounded shadow-md">
      {/* Task progress indicator OR checkmark if all complete */}
      <div className="text-xxs mr-1">
        {isComplete ? (
          <CheckIcon width={25} height={25} stroke="green" className="ml-1" />
        ) : !tasks.length ? (
          <span className="text-red-500">
            NO <br /> TASKS
          </span>
        ) : (
          <span className="text-blue-100">
            <span className="text-sm text-compText font-bold">
              {`${tasks.filter((task) => task.completed === true).length} / ${
                tasks.length
              }`}
            </span>
            <br /> tasks <br /> complete
          </span>
        )}
      </div>

      <h4 className="p-0.5 ml-1">{name}</h4>
      <button
        type="button"
        className="self-start p-0.5 ml-2 mr-1 border border-solid border-white rounded-sm bg-category hover:bg-categoryToggleUnchecked"
      >
        <TasksIcon />
      </button>
    </div>
  );
}
