import { CardStackPlusIcon as AddCategoryIcon } from "@radix-ui/react-icons";
import { ColumnDropdown, Category } from "./index";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateColumn, addCategory } from "../store/actions";
import { getColumnById } from "../store/columns";
import { getSortedCategoriesByColumn } from "../store/categories";
import { nanoid } from "@reduxjs/toolkit";
import React from "react";

type ColumnProps = {
  id: string;
};

export default function Column({ id }: ColumnProps) {
  const dispatch = useAppDispatch();
  const column = useAppSelector((state) => getColumnById(state, id));
  const categoryIds = useAppSelector((state) =>
    getSortedCategoriesByColumn(state, id)
  );

  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(column?.name);

  return (
    <section className="bg-black md:w-[33%] rounded-md text-center flex flex-col items-center p-1 border border-columnBorder">
      <div className="flex items-center justify-center w-full p-0.5">
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
              tabIndex={99}
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
          <ColumnDropdown
            id={id}
            projectId={column?.projectId as string}
            setIsEditing={setIsEditing}
          />
        </div>
      </div>
      <hr className="w-[90%] bg-white" />
      <div className="bg-column h-full w-full mt-2 rounded overflow-y-auto hide-scroll">
        {categoryIds.map((id) => (
          <Category id={id} key={id} />
        ))}
      </div>
      <button
        type="button"
        className="static inset-x-0 bottom-0 bg-green-700 w-full rounded-b-sm opacity-30 flex justify-center hover:opacity-100 focus:opacity-100"
        onClick={() =>
          dispatch(
            addCategory({
              id: nanoid(5),
              columnId: id,
              projectId: column?.projectId as string,
            })
          )
        }
      >
        <AddCategoryIcon width={24} height={24} />
      </button>
    </section>
  );
}
