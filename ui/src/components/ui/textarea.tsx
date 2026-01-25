import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg bg-white transition-all focus:outline-none focus:ring-2 focus:ring-[#1971c2] focus:border-transparent placeholder:text-gray-400 resize-vertical min-h-[80px] ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";