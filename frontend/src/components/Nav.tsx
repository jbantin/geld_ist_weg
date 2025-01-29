import { Link } from "react-router";
import Button from "./Button";
import { motion } from "framer-motion";
import { useState } from "react";

interface NavProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Nav: React.FC<NavProps> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <motion.nav
      className="bg-dark p-4 text-light flex justify-between items-center"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:hidden">
        <Button className="hover:scale-105 p-4" onClick={toggleMenu}>
          ☰
        </Button>
      </div>
      {isOpen && (
        <div className="absolute top-16 left-0 p-4 w-full bg-dark flex flex-col items-center md:hidden">
          <Button className="hover:scale-105  w-full p-2" onClick={() => {}}>
            <Link to="/market">Market</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2" onClick={() => {}}>
            <Link to="/news">News</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2" onClick={() => {}}>
            <Link to="/trade">Trade</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2" onClick={() => {}}>
            <Link to="/user">User</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2" onClick={toggleTheme}>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      )}
      <div className="hidden md:flex space-x-4">
        <Button className="hover:scale-105 bg-secondary p-2" onClick={() => {}}>
          <Link to="/market">Market</Link>
        </Button>
        <Button className="hover:scale-105 bg-secondary p-2" onClick={() => {}}>
          <Link to="/news">News</Link>
        </Button>
        <Button className="hover:scale-105 bg-secondary p-2" onClick={() => {}}>
          <Link to="/trade">Trade</Link>
        </Button>
      </div>
      <div className="hidden md:flex space-x-4">
        <Button className="hover:scale-105 p-2 bg-secondary" onClick={() => {}}>
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
