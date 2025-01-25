import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      className={` hover:bg-green-800 hover:rounded font-bold py-2 px-4 rounded duration-500  ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
