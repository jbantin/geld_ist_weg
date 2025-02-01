import { useEffect, useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";
import Button from "./Button";
import { motion } from "framer-motion";
import "../App.css"

interface Coin {
  symbol: string;
  price: number;
}

const formatNumber = (num: number) => {
  return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Sidebar = () => {
  const { setSelectedCoin } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const selectedCoins = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "ADAUSDT", "LINKUSDT", "LTCUSDT", "BNBUSDT", "XLMUSDT", "POLUSDT", "UNIUSDT", "DOTUSDT", "ICPUSDT", "MATICUSDT", "VETUSDT", "FILUSDT", "TRXUSDT", "ETCUSDT"];

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
      <h2 className="text-xl text-swich font-bold mb-4 p-4">Top Coins</h2>
      <ul className="md:max-h-[80vh] custom-scrollbar overflow-auto px-4" >
        {coins.map((coin) => (
          <li key={coin.symbol} className="mb-2 flex justify-between rounded-lg relative z-0">
            <Button
              className="flex justify-between w-full text-green-300 hover:text-zinc-800 btn-bg p-2"
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
