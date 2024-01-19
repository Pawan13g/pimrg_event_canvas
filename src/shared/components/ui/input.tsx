import * as React from "react";

// UTIL FUNCTIONS
import { cn } from "@/shared/utils/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  rootClassName?: string;
  iconClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      icon,
      iconRight,
      iconClassName,
      rootClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "flex h-10 relative rounded-md border border-input bg-background transition-all overflow-hidden py-2 items-center  hover:border-gray-400 focus-within:border-gray-400",
          rootClassName
        )}
      >
        {icon ? (
          <span
            className={cn(
              props.disabled && "opacity-50 cursor-none",
              "text-lg absolute top-[50%] translate-y-[-50%] left-3",
              iconClassName
            )}
          >
            {icon}
          </span>
        ) : null}

        <input
          type={type}
          className={cn(
            "text-sm px-4 h-10 w-full bg-inherit file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50",
            !!icon && "!pl-10",
            className
          )}
          ref={ref}
          {...props}
        />

        {iconRight && (
          <span
            className={cn(
              props.disabled && "opacity-50 cursor-none",
              "text-lg absolute top-[50%] translate-y-[-50%] right-3"
            )}
          >
            {iconRight}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
