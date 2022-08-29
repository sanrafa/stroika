import { ITask } from "../types";
import { default as tasks } from "./tasks";

export interface Feature {
  featureId: string;
  featureName: string;
  isComplete: boolean; // TODO: change to computed value coerced to boolean
  tasks: ITask[];
}

const testFeatures: Feature[] = [
  {
    featureId: "feat1",
    featureName: "This is feature 1 with a long name.",
    isComplete: false,
    tasks: tasks,
  },
  {
    featureId: "feat2",
    featureName: "This is feature 2.",
    isComplete: true,
    tasks: [
      {
        id: "doneTask1",
        description: "This task is complete.",
        completed: true,
      },
      {
        id: "doneTask2",
        description: "This task is complete.",
        completed: true,
      },
    ],
  },
  {
    featureId: "feat3",
    featureName: "This is feature 3.",
    isComplete: false,
    tasks: [],
  },
  {
    featureId: "feat4",
    featureName: "Another feature with a long name.",
    isComplete: false,
    tasks: [],
  },
];

export default testFeatures;
