export interface Feature {
  featureId: string;
  featureName: string;
  isComplete: boolean; // TODO: change to computed value coerced to boolean
  tasks: string[];
}

const testFeatures: Feature[] = [
  {
    featureId: "feat1",
    featureName: "This is feature 1 with a long name.",
    isComplete: false,
    tasks: ["task1", "task2"],
  },
  {
    featureId: "feat2",
    featureName: "This is feature 2.",
    isComplete: true,
    tasks: [],
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
