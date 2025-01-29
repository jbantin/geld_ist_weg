import { Link } from "react-router";
import Button from "./Button";
import { motion } from "framer-motion";

interface NavProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const Nav: React.FC<NavProps> = ({ theme, setTheme }) => {
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
      <div className="flex space-x-4">
        <Button className="hover:underline bg-secondary" onClick={() => {}}>
          <Link to="/market">Market</Link>
        </Button>
        <Button className="hover:underline bg-secondary" onClick={() => {}}>
          <Link to="/news">News</Link>
        </Button>
      </div>
      <div className="flex space-x-4">
        <Button className="hover:underline bg-secondary" onClick={() => {}}>
          <Link to="/user">User</Link>
        </Button>
        <Button className="hover:underline bg-secondary" onClick={toggleTheme}>
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </motion.nav>
  );
};

export default Nav;
