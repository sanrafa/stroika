import { HamburgerMenuIcon as MenuIcon } from "@radix-ui/react-icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownSeparator,
} from "./index";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { deleteColumn } from "../store/actions";
import { useAppDispatch } from "../store/hooks";

type Props = {
  id: string;
  projectId: string;
};

export default function ColumnDropdown({ id, projectId }: Props) {
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
          <DropdownItem>
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
