import React from "react";
import {
  composeRenderProps,
  Button as RACButton,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "./utils";

export interface ButtonProps extends RACButtonProps {
  variant?: "primary" | "secondary" | "destructive" | "icon";
}

let button = tv({
  extend: focusRing,
  base: "px-5 py-2 text-sm text-center transition rounded-lg border border-black/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] cursor-default",
  variants: {
    variant: {
      primary: "bg-stone-800 hover:bg-stone-900 pressed:bg-stone-950 text-white",
      secondary:
        "bg-stone-100 hover:bg-stone-200 pressed:bg-stone-300 text-stone-800",
      destructive: "bg-red-700 hover:bg-red-800 pressed:bg-red-900 text-white",
      icon: "border-0 p-1 flex items-center justify-center text-stone-600 hover:bg-black/[5%] pressed:bg-black/10 disabled:bg-transparent",
    },
    isDisabled: {
      true: "bg-stone-100 text-stone-300 forced-colors:text-[GrayText] border-black/5",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        button({ ...renderProps, variant: props.variant, className })
      )}
    />
  );
}
