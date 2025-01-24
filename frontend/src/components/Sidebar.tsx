import { useEffect, useState } from "react";

interface Coin {
  symbol: string;
}

interface SidebarProps {
  onSelectCoin: (symbol: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectCoin }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const selectedCoins = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "ADAUSDT", "LINKUSDT"];

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/ticker/24hr")
      .then((res) => res.json())
      .then((data) => {
        const filteredCoins = data.filter((coin: Coin) => selectedCoins.includes(coin.symbol));
        setCoins(filteredCoins);
      });
  }, []);

  return (
    <div className="sidebar bg-zinc-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Top Coins</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.symbol} className="mb-2">
            <button
              className="text-zinc-200 hover:underline"
              onClick={() => onSelectCoin(coin.symbol)}
            >
              {coin.symbol.slice(0, -4)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
