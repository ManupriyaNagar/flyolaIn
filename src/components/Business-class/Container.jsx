import { twMerge } from "tailwind-merge";

export const Container = ({ children, className }) => {
  return (
    <div className={twMerge("mx-auto max-w-[980px] px-6 mt-30", className)}>
      {children}
    </div>
  );
};
