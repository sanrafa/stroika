import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import React from "react";

type Props = {
  children: React.ReactNode;
  content: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
};

export default function Tooltip({ children, content, side, align }: Props) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        sideOffset={6}
        side={side}
        align={align}
        className="bg-compText bg-opacity-90 text-black p-1 rounded font-bold font-manrope shadow z-10"
      >
        {content}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
