import type { Feature } from "./features";
import features from "./features";

interface Category {
  categoryId: string;
  categoryName: string;
  order: number;
  isSuspended: boolean;
  features: Feature[];
}

const testCategories: Category[] = [
  {
    categoryId: "cat1",
    categoryName: "Category 1",
    isSuspended: false,
    order: 1,
    features: features,
  },
  {
    categoryId: "cat2",
    categoryName: "Category 2",
    isSuspended: true,
    order: 2,
    features: [],
  },
  {
    categoryId: "cat3",
    categoryName: "Category 3",
    isSuspended: false,
    order: 3,
    features: [],
  },
];

export default testCategories;
