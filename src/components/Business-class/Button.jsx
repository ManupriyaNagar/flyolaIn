"use client";

import { twMerge } from "tailwind-merge";

export const Button = ({ children, size = "medium", className, ...props }) => {
  const sizeClassNames = {
    small: "text-xs px-2 py-1",
    medium: "text-sm px-5 py-3",
    large: "text-base px-8 py-4",
  };

  return (
    <button
      className={twMerge(
        "text-black rounded-full bg-white hover:bg-gray-100 transition duration-200 shadow-md",
        sizeClassNames[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
