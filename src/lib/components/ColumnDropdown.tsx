import { HamburgerMenuIcon as MenuIcon } from "@radix-ui/react-icons";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownArrow,
} from "./index";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function ColumnDropdown() {
  return (
    <Dropdown>
      <DropdownTrigger asChild={true}>
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
          <DropdownItem className="p-0.5">Edit Column</DropdownItem>
          <DropdownSeparator asChild={true}>
            <hr color="black" />
          </DropdownSeparator>
          <DropdownItem className="p-0.5">Delete Column</DropdownItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </Dropdown>
  );
}
