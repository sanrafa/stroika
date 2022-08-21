import React, { HTMLAttributes, ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface Props {
  children?: ReactNode;
}

const Dropdown = DropdownMenu.Root;
const DropdownLabel = DropdownMenu.Label;
const DropdownItem = DropdownMenu.Item;
const DropdownTrigger = DropdownMenu.Trigger;
const DropdownGroup = DropdownMenu.Group;
const DropdownSeparator = DropdownMenu.Separator;
const DropdownArrow = DropdownMenu.Arrow;

const DropdownContent = React.forwardRef<
  HTMLDivElement,
  Props & HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content ref={ref} {...props} sideOffset={8}>
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
});

export {
  Dropdown,
  DropdownTrigger,
  DropdownLabel,
  DropdownItem,
  DropdownGroup,
  DropdownSeparator,
  DropdownContent,
  DropdownArrow,
};
