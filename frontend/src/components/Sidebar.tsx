import { useEffect, useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";

interface Coin {
  symbol: string;
  price: string;
}

const Sidebar = () => {
  const { setSelectedCoin } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const selectedCoins = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "ADAUSDT", "LINKUSDT"];

  const fetchPrices = () => {
    fetch("https://api.binance.com/api/v3/ticker/price")
      .then((res) => res.json())
      .then((data) => {
        const filteredCoins = data.filter((coin: Coin) => selectedCoins.includes(coin.symbol));
        setCoins(filteredCoins);
      });
  };

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 5000); // Aktualisiere alle 10 Sekunden

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sidebar bg-zinc-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Top Coins</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.symbol} className="mb-2 flex justify-between bg-zinc-700 p-2 rounded-lg">
            <button
              className="text-zinc-400 hover:underline"
              onClick={() => setSelectedCoin(coin.symbol)}
            >
              {coin.symbol.slice(0, -4)}
            </button>
            <span className="text-zinc-300 px-2">{parseFloat(coin.price).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
