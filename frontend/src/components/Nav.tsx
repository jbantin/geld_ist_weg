import { Link } from "react-router";

const Nav = () => {
  return (
    <nav className="bg-zinc-800 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-4">
        <Link to="/market" className="hover:underline">
          Market
        </Link>
        <Link to="/news" className="hover:underline">
          News
        </Link>
      </div>
      <div>
        <Link to="/user" className="hover:underline">
          User
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
