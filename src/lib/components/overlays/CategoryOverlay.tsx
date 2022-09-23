import { Checkbox, CheckboxIndicator } from "../index";
import {
  ChevronDownIcon as Chevron,
  PlusCircledIcon as AddIcon,
  TrashIcon as DeleteIcon,
  DragHandleDots2Icon as DragIcon,
} from "@radix-ui/react-icons";
import { useAppSelector } from "../../store/hooks";

import { getCategoryById } from "../../store/categories";

type CategoryProps = {
  id: string;
};

export default function CategoryOverlay({ id }: CategoryProps) {
  const category = useAppSelector((state) => getCategoryById(state, id));

  return (
    <div className="flex flex-col items-center justify-center bg-categoryDrag m-1 p-2 font-manrope text-compText rounded-md shadow-md  max-w-11/12 cursor-grabbing">
      <h1 className="text-3xl p-2">{category?.name}</h1>
      <div className="flex items-center justify-center ">
        <button>
          <DragIcon
            className="block text-slate-500 hover:text-compText rotate-90 cursor-grabbing"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}
