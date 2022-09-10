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

type Props = {
  id: string;
  projectId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ColumnDropdown({ id, projectId, setIsEditing }: Props) {
  const dispatch = useAppDispatch();

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button type="button" className="hover:bg-gray-700">
          <MenuIcon />
        </button>
      </DropdownTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white text-black text-center p-0.5"
          align="start"
          alignOffset={15}
          sideOffset={4}
        >
          {/* The 1st dropdown item cannot render as child - Radix bug? */}
          <DropdownItem onClick={() => setIsEditing(true)}>
            <button type="button" className="p-0.5">
              Rename Column
            </button>
          </DropdownItem>
          <DropdownSeparator asChild>
            <hr color="black" />
          </DropdownSeparator>
          <DropdownItem asChild>
            <button
              type="button"
              className="p-0.5"
              onClick={() => dispatch(deleteColumn({ id, projectId }))}
            >
              Delete Column
            </button>
          </DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </Dropdown>
  );
}
