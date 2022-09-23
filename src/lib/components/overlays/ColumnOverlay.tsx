import {
  WidthIcon as DragIcon,
  HamburgerMenuIcon as MenuIcon,
} from "@radix-ui/react-icons";
import { useAppSelector } from "../../store/hooks";
import { getColumnById } from "../../store/columns";
import { getSortedCategoriesByColumn } from "../../store/categories";
import { CategoryOverlay } from "./index";

type Props = {
  id: string;
};

export default function ColumnOverlay({ id }: Props) {
  const column = useAppSelector((state) => getColumnById(state, id));
  const categoryIds = useAppSelector((state) =>
    getSortedCategoriesByColumn(state, id)
  );

  return (
    <section className="bg-black w-full h-full rounded-md text-center flex flex-col items-center p-1 border border-columnBorder">
      <div className="flex items-center justify-around w-full p-0.5">
        <button type="button" className="hover:bg-gray-700 p-0.5 rounded">
          <MenuIcon width={24} height={24} />
        </button>
        <form>
          <input
            type="text"
            disabled
            value={column?.name}
            className="font-manrope text-xl text-center p-1 text-black font-bold disabled:text-compText disabled:bg-slate-900 disabled:cursor-pointer tracking-widest rounded-sm"
          />
        </form>

        <button className=" hover:bg-blue-300 hover:text-black p-0.5 rounded">
          <DragIcon width={24} height={24} />
        </button>
      </div>
      <hr className="w-[90%] bg-white" />

      <div className="bg-column h-full w-full mt-2 rounded overflow-y-auto hide-scroll">
        {categoryIds.map((id) => (
          <CategoryOverlay id={id} key={id} />
        ))}
      </div>
    </section>
  );
}
