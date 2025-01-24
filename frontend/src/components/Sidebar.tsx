import { useEffect, useState } from "react";

interface Coin {
  id: string;
  name: string;
}

interface SidebarProps {
  onSelectCoin: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectCoin }) => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    fetch("https://api.example.com/coins")
      .then((res) => res.json())
      .then((data) => setCoins(data));
  }, []);

  return (
    <div className="sidebar bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Coins</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id} className="mb-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => onSelectCoin(coin.id)}
            >
              {coin.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
