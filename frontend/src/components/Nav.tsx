import { Link } from "react-router";
import Button from "./Button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface NavProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Nav: React.FC<NavProps> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest(".burger-menu")) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <motion.nav
      className="bg-dark p-4 text-light flex justify-between items-center"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between w-full md:hidden">
        <Button className="hover:scale-105 p-4 text-text burger-menu" onClick={toggleMenu}>
          ☰
        </Button>
        <Button className="hover:scale-105 p-4 text-text" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
      {isOpen && (
        <motion.div
          className="absolute top-16 left-0 p-4 w-full bg-dark flex flex-col items-center md:hidden burger-menu"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button className="hover:scale-105 w-full p-2 text-text" onClick={closeMenu}>
            <Link to="/market">Market</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2 text-text" onClick={closeMenu}>
            <Link to="/news">News</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2 text-text" onClick={closeMenu}>
            <Link to="/trade">Trade</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2 text-text" onClick={closeMenu}>
            <Link to="/user">User</Link>
          </Button>
        </motion.div>
      )}
      <div className="hidden md:flex space-x-4">
        <Button className="hover:scale-105 bg-secondary p-2" onClick={closeMenu}>
          <Link to="/market">Market</Link>
        </Button>
        <Button className="hover:scale-105 bg-secondary p-2" onClick={closeMenu}>
          <Link to="/news">News</Link>
        </Button>
        <Button className="hover:scale-105 bg-secondary p-2" onClick={closeMenu}>
          <Link to="/trade">Trade</Link>
        </Button>
      </div>
      <div className="hidden md:flex space-x-4">
        <Button className="hover:scale-105 p-2 bg-secondary" onClick={closeMenu}>
          <Link to="/user">User</Link>
        </Button>
        <Button className="hover:scale-105 p-2 bg-secondary" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </motion.nav>
  );
};

export default Nav;
