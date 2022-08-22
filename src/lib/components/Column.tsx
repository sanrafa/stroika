import { ColumnDropdown, Category } from "./index";
import categories from "../mocks/categories";

type ColumnProps = {
  name: string;
};

export default function Column({ name }: ColumnProps) {
  return (
    <section className="bg-black w-[33%] rounded-md text-center flex flex-col items-center p-1 border border-columnBorder">
      <div className="flex items-center justify-center w-full">
        <h1
          className="font-manrope text-3xl tracking-widest p-1
      "
        >
          {name}
        </h1>
        <div className="pl-4">
          <ColumnDropdown />
        </div>
      </div>
      <hr className="w-[90%] bg-white" />
      <div className="bg-column h-full w-full mt-2 rounded overflow-y-auto hide-scroll">
        {categories.map((cat) => (
          <Category name={cat.categoryName} key={cat.categoryId} />
        ))}
      </div>
    </section>
  );
}
