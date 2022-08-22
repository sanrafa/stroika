import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import React from "react";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>((props, forwardedRef) => {
  const { children } = props;
  return (
    <CheckboxPrimitive.Root {...props} ref={forwardedRef}>
      {children}
    </CheckboxPrimitive.Root>
  );
});

export const CheckboxIndicator = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Indicator>,
  React.ComponentProps<typeof CheckboxPrimitive.Indicator>
>((props, forwardedRef) => {
  const { children } = props;
  return (
    <CheckboxPrimitive.Indicator {...props} ref={forwardedRef}>
      {children}
    </CheckboxPrimitive.Indicator>
  );
});
