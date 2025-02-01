import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      className={`bg-light hover:bg-accent hover:cursor-pointer duration-200 font-bold rounded ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
