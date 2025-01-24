import { useEffect, useState } from "react";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;  // Rang der Marktkapitalisierung hinzugefügt
}

interface SidebarProps {
  onSelectCoin: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectCoin }) => {
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    // Verwende die 'markets'-API, um Coins nach Marktkapitalisierung zu holen
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1")
      .then((res) => res.json())
      .then((data) => {
        // Filtere nur die Top 10 Coins nach Marktkapitalisierung
        setCoins(data.filter((coin: Coin) => coin.market_cap_rank <= 10));
      });
  }, []);

  return (
    <div className="sidebar bg-zinc-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Top Coins</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id} className="mb-2">
            <button
              className="text-zinc-200 hover:underline"
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
