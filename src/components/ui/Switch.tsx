import React from 'react';
import {
  Switch as AriaSwitch,
  SwitchProps as AriaSwitchProps
} from 'react-aria-components';
import { tv } from 'tailwind-variants';
import { composeTailwindRenderProps, focusRing } from './utils';

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children: React.ReactNode;
}

const track = tv({
  extend: focusRing,
  base: 'flex h-6 w-11 px-px items-center shrink-0 cursor-default rounded-full transition duration-200 ease-in-out shadow-inner border border-transparent',
  variants: {
    isSelected: {
      false: 'bg-stone-300 group-pressed:bg-stone-400',
      true: 'bg-emerald-600 forced-colors:bg-[Highlight]! group-pressed:bg-emerald-700',
    },
    isDisabled: {
      true: 'bg-stone-200 forced-colors:group-selected:bg-[GrayText]! forced-colors:border-[GrayText]',
    }
  }
});

const handle = tv({
  base: 'h-5 w-5 transform rounded-full bg-white outline outline-1 -outline-offset-1 outline-transparent shadow-sm transition duration-200 ease-in-out',
  variants: {
    isSelected: {
      false: 'translate-x-0',
      true: 'translate-x-[100%]'
    },
    isDisabled: {
      true: 'forced-colors:outline-[GrayText]'
    }
  }
});

export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props} className={composeTailwindRenderProps(props.className, 'group flex gap-2 items-center text-stone-800 disabled:text-stone-300 forced-colors:disabled:text-[GrayText] text-sm transition')}>
      {(renderProps) => (
        <>
          <div className={track(renderProps)}>
            <span className={handle(renderProps)} />
          </div>
          {children}
        </>
      )}
    </AriaSwitch>
  );
}
