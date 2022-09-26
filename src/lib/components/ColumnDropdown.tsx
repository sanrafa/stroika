import { HamburgerMenuIcon as MenuIcon } from "@radix-ui/react-icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownSeparator,
} from "./index";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

import { deleteColumn, clearColumn } from "../store/actions";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-hot-toast";

type Props = {
  id: string;
  projectId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export default function ColumnDropdown({
  id,
  projectId,
  setIsEditing,
  isEditing,
  inputRef,
}: Props) {
  const dispatch = useAppDispatch();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          type="button"
          className="hover:bg-gray-700 p-0.5 rounded"
          aria-label="open column menu"
        >
          <MenuIcon width={24} height={24} />
        </button>
      </DropdownTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white text-black text-center p-1 font-bold rounded"
          align="center"
          sideOffset={4}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            if (isEditing) {
              inputRef?.current?.focus();
            }
          }}
        >
          {/* The 1st dropdown item cannot render as child - Radix bug? */}
          <DropdownItem
            onSelect={() => {
              setIsEditing(true);
              inputRef?.current?.focus();
            }}
            className="p-0.5 hover:bg-slate-800 hover:text-compText focus:bg-slate-800 focus:text-compText cursor-pointer"
          >
            Rename Column
          </DropdownItem>
          <DropdownItem
            onSelect={() => {
              dispatch(clearColumn({ id }));
            }}
            className="p-0.5 hover:bg-slate-800 hover:text-compText cursor-pointer w-full focus:bg-slate-800 focus:text-compText"
          >
            Clear Column
          </DropdownItem>
          <DropdownSeparator asChild>
            <hr color="black" />
          </DropdownSeparator>
          <DropdownItem
            onSelect={() => {
              dispatch(deleteColumn({ id, projectId }));
              toast.success("Column deleted.", {
                className: "bg-red-300 font-bold",
                duration: 1000,
                iconTheme: {
                  primary: "red",
                  secondary: "white",
                },
              });
            }}
            className="p-0.5 hover:bg-slate-800 hover:text-compText cursor-pointer w-full focus:bg-slate-800 focus:text-compText"
          >
            Delete Column
          </DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </Dropdown>
  );
}
