import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      className={`bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded m-1 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
