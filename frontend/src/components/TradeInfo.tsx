import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Trade {
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
}

interface Stats {
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

interface TradeInfoProps {
  symbol: string;
}

const TradeInfo: React.FC<TradeInfoProps> = ({ symbol }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchRecentTrades = () => {
    fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=5`)
      .then((response) => response.json())
      .then((data) => data.sort((a: Trade, b: Trade) => b.time - a.time))
      .then((data) => setTrades(data))
      .catch((error) => console.error('Fehler beim Abrufen der letzten Trades:', error));
  };

  const fetch24HourStats = () => {
    fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error('Fehler beim Abrufen der 24-Stunden Statistiken:', error));
  };

  useEffect(() => {
    fetchRecentTrades();
    fetch24HourStats();
    const intervalId = setInterval(() => {
      fetchRecentTrades();
    }, 1000); // Aktualisiere die letzten Trades jede Sekunde
    return () => clearInterval(intervalId);
  }, [symbol]);

  return (<>
    <h2 className="text-2xl font-bold mb-4 bg-zinc-800 w-full text-center rounded-lg p-4">Trade Info</h2>
      <motion.div
      className="trade-info flex justify-center items-center bg-zinc-800 text-white p-4 rounded-lg w-full "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      {stats && (
        <div className="mb-4 w-1/3 flex flex-col self-start">
          <h3 className="text-xl font-bold mb-2 ">Stats 24h</h3>
          <p className="text-l my-1"><strong>Letzter Preis: </strong>{Number(stats.lastPrice).toFixed(2)} $</p>
          <p className="text-l my-1"><strong>Preisänderung: </strong><span className={`${stats.priceChangePercent.includes("-")? "text-red-500":""}`}>{stats.priceChangePercent} %</span></p>
          <p className="text-l my-1"><strong>Höchster Preis: </strong>{Number(stats.highPrice).toFixed(2)} $</p>
          <p className="text-l my-1"><strong>Niedrigster Preis: </strong>{Number(stats.lowPrice).toFixed(2)} $</p>
          <p className="text-l my-1"><strong>Volumen: </strong>{Number(stats.volume).toFixed(2)}</p>
        </div>
      )}
      <div className="w-1/3">   
        <h3 className="text-xl font-bold mb-2">Letzte Trades</h3>
        <ul className="space-y-1">
          {trades.map((trade, index) => (
            <li
              key={index}
              className={`flex justify-between p-2 rounded text-sm ${
                trade.isBuyerMaker ? "bg-red-700" : "bg-green-700"
              }`}
            >
              <span>{new Date(trade.time).toLocaleTimeString()}</span>
              <span>{Number(trade.price).toFixed(2)}</span>
              <span>{Number(trade.qty).toFixed(5)}</span>
              <span>{trade.isBuyerMaker ? "Sell" : "Buy"}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
    </>
  );
};

export default TradeInfo;
