import type { Feature } from "./features";
import features from "./features";

interface Category {
  categoryId: string;
  categoryName: string;
  order: number;
  features: Feature[];
}

const testCategories: Category[] = [
  {
    categoryId: "cat1",
    categoryName: "Category 1",
    order: 1,
    features: features,
  },
  {
    categoryId: "cat2",
    categoryName: "Category 2",
    order: 2,
    features: [],
  },
  {
    categoryId: "cat3",
    categoryName: "Category 3",
    order: 3,
    features: [],
  },
];

export default testCategories;
