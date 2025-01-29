import { useEffect, useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";
import Button from "./Button";
import { motion } from "framer-motion";

interface Coin {
  symbol: string;
  price: number;
}

const Sidebar = () => {
  const { setSelectedCoin } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const selectedCoins = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "ADAUSDT", "LINKUSDT"];

  const fetchPrices = () => {
    fetch("https://api.binance.com/api/v3/ticker/price")
      .then((res) => res.json())
      .then((data) => {
        const filteredCoins = data
          .filter((coin: any) => selectedCoins.includes(coin.symbol))
          .map((coin: any) => ({
            symbol: coin.symbol,
            price: parseFloat(coin.price),
          }));
        setCoins(filteredCoins);
      });
  };

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarVisible(window.innerWidth >= 1200); // Nur auf großen Desktops anzeigen
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isSidebarVisible) return null;

  return (
    <motion.div
      className="sidebar bg-dark text-light p-4 min-w-[220px]"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-lg text-text font-bold my-4 p-3">Top Coins</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.symbol} className="mb-2 flex justify-between rounded-lg">
            <Button
              className="flex justify-between w-full text-green-600 bg-secondary hover:underline p-2"
              onClick={() => setSelectedCoin(coin.symbol)}
            >
              <span>{coin.symbol.slice(0, -4)}</span>
              <span className="text-zinc-300 px-2">{coin.price.toFixed(2)} $</span>
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
