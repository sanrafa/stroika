import { CardStackPlusIcon as AddCategoryIcon } from "@radix-ui/react-icons";
import { ColumnDropdown, Category } from "./index";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateColumn, addCategory } from "../store/actions";
import { getColumnById } from "../store/columns";
import { getSortedCategoriesByColumn } from "../store/categories";
import { nanoid } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
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

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) inputRef?.current?.focus();
  }, [isEditing]);

  const handleSubmit = () => {
    if (!name) {
      toast.error("Column name cannot be blank!", { duration: 2000 });
      return;
    }
    dispatch(updateColumn({ id, changes: { name: name.trim() } }));
    setName(name.trim());
    setIsEditing(false);
  };

  return (
    <section className="bg-black md:w-[33%] rounded-md text-center flex flex-col items-center p-1 border border-columnBorder">
      <div className="flex items-center justify-center p-0.5">
        <form
          onClick={() => {
            setIsEditing(true);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={name}
            aria-label="column name"
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className="font-manrope text-xl text-center p-1 text-black font-bold disabled:text-compText disabled:bg-slate-900 disabled:cursor-pointer tracking-widest rounded-sm"
            onBlur={() => {
              handleSubmit();
            }}
          />
          <button
            type="submit"
            className="hidden"
            aria-label="update column name"
          ></button>
        </form>

        <div className={`${isEditing ? "hidden" : "pl-4"}`}>
          <ColumnDropdown
            id={id}
            projectId={column?.projectId as string}
            setIsEditing={setIsEditing}
            inputRef={inputRef}
            isEditing={isEditing}
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
        aria-label="add new category"
        type="button"
        className="static inset-x-0 bottom-0 bg-green-700 w-full rounded-b-sm opacity-30 flex justify-center hover:opacity-100 focus:opacity-100"
        onMouseDown={(e) => {
          e.preventDefault();
          dispatch(
            addCategory({
              id: nanoid(5),
              columnId: id,
              projectId: column?.projectId as string,
            })
          );
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            dispatch(
              addCategory({
                id: nanoid(5),
                columnId: id,
                projectId: column?.projectId as string,
              })
            );
          }
        }}
      >
        <AddCategoryIcon width={24} height={24} />
      </button>
    </section>
  );
}
