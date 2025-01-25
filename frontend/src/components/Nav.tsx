import { Link } from "react-router";
import Button from "./Button";

const Nav = () => {
  return (
    <nav className="bg-zinc-800 p-4 text-white flex justify-between items-center">
      <div className="flex space-x-4">
        <Button className="hover:underline bg-zinc-700" onClick={() => {}}>
          <Link to="/market">Market</Link>
        </Button>
        <Button className="hover:underline bg-zinc-700" onClick={() => {}}>
          <Link to="/news">News</Link>
        </Button>
      </div>
      <div>
        <Button className="hover:underline bg-zinc-700" onClick={() => {}}>
          <Link to="/user">User</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Nav;
