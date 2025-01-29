import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import Button from "./Button";
import { DefaultContext } from "../context/DefaultContext";

interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
}

const Market: React.FC = () => {
  const { setSelectedCoin } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [sortBy, setSortBy] = useState<"priceChangePercent" | "volume">("priceChangePercent");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const selectedCoins = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "SOLUSDT", "DOGEUSDT", "ADAUSDT", "LINKUSDT"];
  const navigate = useNavigate();

  const fetch24HourStats = async () => {
    try {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json();
      const filteredCoins = data
        .filter((coin: any) => selectedCoins.includes(coin.symbol))
        .map((coin: any) => ({
          symbol: coin.symbol,
          lastPrice: parseFloat(coin.lastPrice),
          priceChangePercent: parseFloat(coin.priceChangePercent),
          highPrice: parseFloat(coin.highPrice),
          lowPrice: parseFloat(coin.lowPrice),
          volume: parseFloat(coin.volume),
        }));
      setCoins(filteredCoins);
    } catch (error) {
      console.error("Fehler beim Abrufen der 24-Stunden Statistiken:", error);
    }
  };

  useEffect(() => {
    fetch24HourStats();
    const intervalId = setInterval(fetch24HourStats, 60000); // 1 Minute

    return () => clearInterval(intervalId);
  }, []);

  const handleCoinClick = (symbol: string) => {
    setSelectedCoin(symbol);
    navigate("/trade");
  };

  const handleSort = (criteria: "priceChangePercent" | "volume") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    return (a[sortBy] - b[sortBy]) * order;
  });

  return (
    <motion.div
      className="flex flex-col w-full h-full p-4 bg-dark text-light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-text">Market Overview</h2>
      <div className="flex justify-between mb-4">
        <Button className="mr-2 text-light p-2 bg-secondary" onClick={() => handleSort("priceChangePercent")}>
          Sort by 24h Change
        </Button>
        <Button className="text-light p-2 bg-secondary" onClick={() => handleSort("volume")}>
          Sort by Volume
        </Button>
      </div>
      <ul className="space-y-4">
        {sortedCoins.map((coin) => (
          <li key={coin.symbol} >
            <Button
              className="w-full text-left p-4 bg-secondary rounded-lg"
              onClick={() => handleCoinClick(coin.symbol)}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl">{coin.symbol.slice(0, -4)}</span>
                <span className="text-lg">{coin.lastPrice.toFixed(2)} $</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm ${coin.priceChangePercent < 0 ? "text-red-500" : "text-green-500"}`}>
                  {coin.priceChangePercent.toFixed(2)} %
                </span>
                <span className="text-sm">High: {coin.highPrice.toFixed(2)} $</span>
                <span className="text-sm">Low: {coin.lowPrice.toFixed(2)} $</span>
                <span className="text-sm">Volume: {(coin.volume / 1e9).toFixed(2)} B</span>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Market;
