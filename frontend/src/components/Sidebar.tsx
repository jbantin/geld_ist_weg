import { useEffect, useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";
import Button from "./Button";
import { motion } from "framer-motion";

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
    const intervalId = setInterval(fetchPrices, 5000); // Aktualisiere alle 5 Sekunden

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      className="sidebar bg-zinc-800 text-white p-4 pt-25 min-w-[220px]"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Top Coins</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.symbol} className="mb-2 flex justify-between rounded-lg">
            <Button
              className="flex justify-between w-full text-zinc-400 bg-zinc-700 hover:underline"
              onClick={() => setSelectedCoin(coin.symbol)}
            >
              <span>{coin.symbol.slice(0, -4)}</span>
              <span className="text-zinc-300 px-2">{parseFloat(coin.price).toFixed(2)} $</span>
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
