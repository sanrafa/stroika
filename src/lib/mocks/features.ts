export interface Feature {
  featureId: string;
  featureName: string;
  isComplete: boolean;
}

const testFeatures: Feature[] = [
  {
    featureId: "feat1",
    featureName: "Feature 1",
    isComplete: false,
  },
  {
    featureId: "feat2",
    featureName: "Feature 2",
    isComplete: true,
  },
  {
    featureId: "feat3",
    featureName: "Feature 3",
    isComplete: false,
  },
];

export default testFeatures;
