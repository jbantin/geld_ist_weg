import { useEffect, useState, useContext } from "react";
import { DefaultContext } from "../../context/DefaultContext";
import Button from "../ui/Button";
import { motion } from "framer-motion";
import "../../App.css"

interface Coin {
  symbol: string;
  price: number;
}

const formatNumber = (num: number) => {
  return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Sidebar = () => {
  const { setSelectedCoin, selectedCoins } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
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
      className="sidebar bg-dark text-swich w-[10vw]  min-w-[220px] "      
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-xl text-swich font-bold mb-8 p-4">Top Coins</h2>
      <ul className="md:max-h-[74vh] custom-scrollbar overflow-auto pl-4 pr-1 " >
        {coins.map((coin) => (
          <li key={coin.symbol} className="mb-2 flex justify-between rounded-lg relative z-0">
            <Button
              className="flex justify-between w-full text-green-700 hover:text-gray-800 btn-bg p-2"
              onClick={() => setSelectedCoin(coin.symbol)}
            >
              <span className="">{coin.symbol.slice(0, -4)}</span>
              <span className="text-swich px-2">{formatNumber(coin.price)} $</span>
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
