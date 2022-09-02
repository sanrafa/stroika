import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { ColumnDropdown, Category } from "./index";
import { useAppSelector } from "../store/hooks";
import categories from "../mocks/categories";

type ColumnProps = {
  id: string;
};

export default function Column({ id }: ColumnProps) {
  const column = useAppSelector((state) => state.columns.entities[id]);

  return (
    <section className="bg-black md:w-[33%] rounded-md text-center flex flex-col items-center p-1 border border-columnBorder">
      <div className="flex items-center justify-center w-full">
        <h1
          className="font-manrope text-3xl tracking-widest p-1
      "
        >
          {column?.name}
        </h1>
        <div className="pl-4">
          <ColumnDropdown />
        </div>
      </div>
      <hr className="w-[90%] bg-white" />
      <div className="bg-column h-full w-full mt-2 rounded overflow-y-auto hide-scroll">
        {column?.categories.map((id) => (
          <Category id={id} key={id} />
        ))}
      </div>
      <button
        type="button"
        className="static inset-x-0 bottom-0 bg-green-700 w-full rounded-b-sm opacity-30 flex justify-center hover:opacity-100"
      >
        <CardStackPlusIcon width={24} height={24} />
      </button>
    </section>
  );
}
