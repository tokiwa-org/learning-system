import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#1971c2] focus:border-transparent placeholder:text-gray-400 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
