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
    <div className="flex flex-col bg-categoryDrag justify-between m-1 pb-2 font-manrope text-compText rounded-md shadow-md  max-w-11/12">
      <header className="flex items-center justify-between pr-4 md:space-x-8">
        <div className="flex flex-col items-center justify-center p-4 leading-3 md:-mr-6">
          <Checkbox
            aria-label="mark category as suspended"
            checked={category?.suspended}
            className="bg-categoryToggleUnchecked w-7 h-7 flex justify-center items-center shadow-inset rounded mb-2"
          >
            <CheckboxIndicator>
              <div className="bg-categoryToggleChecked w-7 h-7 shadow-[0px_2px_4px_rgba(0, 0, 0, 0.17)] rounded-sm"></div>
            </CheckboxIndicator>
          </Checkbox>

          <button type="button" className="-mb-4 focus:outline-1">
            <Chevron width={32} height={32} color="black" />
          </button>
        </div>

        <div className="mr-4 flex flex-col justify-evenly">
          <form className="mt-2 mb-1">
            <input
              type="text"
              className="text-compText focus:text-black bg-category focus:bg-compText cursor-pointer text-center p-1 text-lg lg:text-2xl w-full rounded-md focus:cursor-text"
              value={category?.name}
            />
          </form>
          <div className="flex items-center justify-center ">
            <button>
              <DragIcon
                className="block text-slate-500 hover:text-compText rotate-90"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-2">
          <button
            type="button"
            disabled={category?.suspended}
            className={category?.suspended ? "opacity-50" : ""}
          >
            <AddIcon width={24} height={24} />
          </button>

          <button aria-label="delete category" type="button">
            <DeleteIcon width={24} height={24} />
          </button>
        </div>
      </header>
    </div>
  );
}
