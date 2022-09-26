import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface Props {
  children?: React.ReactNode;
}

const Dropdown = DropdownMenu.Root;
const DropdownLabel = DropdownMenu.Label;
const DropdownItem = DropdownMenu.Item;
const DropdownCheckboxItem = DropdownMenu.CheckboxItem;
const DropdownItemIndicator = DropdownMenu.DropdownMenuItemIndicator;
const DropdownTrigger = DropdownMenu.Trigger;
const DropdownGroup = DropdownMenu.Group;
const DropdownSeparator = DropdownMenu.Separator;
const DropdownArrow = DropdownMenu.Arrow;
const DropdownSubmenu = DropdownMenu.Sub;
const DropdownSubTrigger = DropdownMenu.SubTrigger;
const DropdownSubContent = DropdownMenu.SubContent;

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  Props & React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
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
  DropdownCheckboxItem,
  DropdownItemIndicator,
  DropdownSubmenu,
  DropdownSubContent,
  DropdownSubTrigger,
};
