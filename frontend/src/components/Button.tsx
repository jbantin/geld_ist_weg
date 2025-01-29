import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      className={`bg-light hover:bg-accent hover:cursor-pointer  font-bold rounded duration-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
