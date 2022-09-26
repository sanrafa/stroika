import { HamburgerMenuIcon as MenuIcon } from "@radix-ui/react-icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownSeparator,
} from "./index";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

import { deleteColumn } from "../store/actions";
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
          className="bg-white text-black text-center p-0.5"
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
          >
            <button type="button" className="p-0.5">
              Rename Column
            </button>
          </DropdownItem>
          <DropdownSeparator asChild>
            <hr color="black" />
          </DropdownSeparator>
          <DropdownItem
            asChild
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
          >
            <button type="button" className="p-0.5">
              Delete Column
            </button>
          </DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </Dropdown>
  );
}
