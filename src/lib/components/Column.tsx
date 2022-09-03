import { CardStackPlusIcon as AddCategoryIcon } from "@radix-ui/react-icons";
import { ColumnDropdown, Category } from "./index";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateColumn } from "../store/actions";
import React from "react";
import categories from "../mocks/categories";

type ColumnProps = {
  id: string;
};

export default function Column({ id }: ColumnProps) {
  const dispatch = useAppDispatch();
  const column = useAppSelector((state) => state.columns.entities[id]);

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(column?.name);

  return (
    <section className="bg-black md:w-[33%] rounded-md text-center flex flex-col items-center p-1 border border-columnBorder">
      <div className="flex items-center justify-center w-full">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(updateColumn({ id, changes: { name } }));
              setIsEditing(false);
            }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="font-manrope text-3xl text-center p-1 w-1/2 bg-slate-900 outline outline-1 outline-slate-50 tracking-widest"
            />
            <button type="submit" className="hidden"></button>
          </form>
        ) : (
          <h1
            className="font-manrope text-3xl tracking-widest p-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {column?.name}
          </h1>
        )}

        <div className={`${isEditing ? "hidden" : "pl-4"}`}>
          <ColumnDropdown id={id} projectId={column?.projectId as string} />
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
        <AddCategoryIcon width={24} height={24} />
      </button>
    </section>
  );
}
