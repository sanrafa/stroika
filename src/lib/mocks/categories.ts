interface Category {
  categoryId: string;
  categoryName: string;
  order: number;
  features?: [];
}

const testCategories: Category[] = [
  {
    categoryId: "cat1",
    categoryName: "Category 1",
    order: 1,
  },
  {
    categoryId: "cat2",
    categoryName: "Category 2",
    order: 2,
  },
  {
    categoryId: "cat3",
    categoryName: "Category 3",
    order: 3,
  },
];

export default testCategories;
