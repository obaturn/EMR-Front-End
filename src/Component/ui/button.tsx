import type { FC, ButtonHTMLAttributes } from "react";
import {cn} from "../../lib/utils.tsx";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "lg";
}

const Button: FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-full text-sm tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    default: "bg-orange-400 text-white hover:bg-orange-500",
    outline:
      "bg-gray-400 text-white border-gray-400 hover:bg-gray-500 hover:border-gray-500 border",
  };

  const sizeStyles = {
    default: "py-2 px-4",
    lg: "py-3 px-6",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;