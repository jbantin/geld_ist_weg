import { Link } from "react-router-dom";
import Button from "./Button";
import { motion } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { DefaultContext } from "../../context/DefaultContext";

interface NavProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Nav: React.FC<NavProps> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn } = useContext(DefaultContext);

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
      className="bg-dark p-4 text-swich flex justify-between items-center"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between w-full md:hidden">
        <Button className="hover:scale-105 p-4 text-swich burger-menu btn-bg" onClick={toggleMenu}>
          ☰
        </Button>
        <Button className="hover:scale-105 w-fit p-2 text-swich ml-auto btn-bg mr-4" onClick={closeMenu}>
          <Link to={isLoggedIn ? "/profile" : "/login"}>
            <div className="w-10 h-10 rounded-lg shadow-2xl overflow-hidden">
              <img src="../user.png" alt="User" className="w-full h-full object-cover p-2" />
            </div>
          </Link>
        </Button>
        <Button className="hover:scale-105 btn-bg p-4 text-swich" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
      {isOpen && (
        <motion.div
          className="absolute top-18 left-0 p-4 z-1000 w-full bg-dark flex flex-col items-center md:hidden burger-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button className="hover:scale-105 w-full p-2 text-swich" onClick={closeMenu}>
            <Link to="/market">Market</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2 text-swich" onClick={closeMenu}>
            <Link to="/news">News</Link>
          </Button>
          <Button className="hover:scale-105 w-full p-2 text-swich" onClick={closeMenu}>
            <Link to="/trade">Trade</Link>
          </Button>
        </motion.div>
      )}
      <div className="hidden md:flex space-x-4">
        <Button className="hover:scale-105 btn-bg p-2" onClick={closeMenu}>
          <Link to="/market">Market</Link>
        </Button>
        <Button className="hover:scale-105 btn-bg p-2" onClick={closeMenu}>
          <Link to="/news">News</Link>
        </Button>
        <Button className="hover:scale-105 btn-bg p-2" onClick={closeMenu}>
          <Link to="/trade">Trade</Link>
        </Button>
      </div>
      <div className="hidden md:flex space-x-4">
        <Button className="hover:scale-105 p-2 btn-bg" onClick={closeMenu}>
          <Link to={isLoggedIn ? "/profile" : "/login"}>
            <div className="w-10 h-10 rounded-lg shadow-2xl overflow-hidden">
              <img src="../user.png" alt="User" className="w-full h-full object-cover p-2" />
            </div>
          </Link>
        </Button>
        <Button className="hover:scale-105 p-2 btn-bg" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </motion.nav>
  );
};

export default Nav;
