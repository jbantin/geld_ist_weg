import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Trade {
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean;
}

interface Stats {
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
}

interface TradeInfoProps {
  symbol: string;
}

const TradeInfo: React.FC<TradeInfoProps> = ({ symbol }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchRecentTrades = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=5`);
      const data = await response.json();
      const sortedData = data.sort((a: Trade, b: Trade) => b.time - a.time);
      setTrades(sortedData.map((trade: any) => ({
        ...trade,
        price: parseFloat(trade.price),
        qty: parseFloat(trade.qty),
      })));
    } catch (error) {
      console.error('Fehler beim Abrufen der letzten Trades:', error);
    }
  };

  const fetch24HourStats = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();
      setStats({
        lastPrice: parseFloat(data.lastPrice),
        priceChangePercent: parseFloat(data.priceChangePercent),
        highPrice: parseFloat(data.highPrice),
        lowPrice: parseFloat(data.lowPrice),
        volume: parseFloat(data.volume),
      });
    } catch (error) {
      console.error('Fehler beim Abrufen der 24-Stunden Statistiken:', error);
    }
  };

  useEffect(() => {
    fetchRecentTrades();
    fetch24HourStats();
    const intervalId = setInterval(() => {
      fetchRecentTrades();
    }, 1000); 
    return () => clearInterval(intervalId);
  }, [symbol]);

  return (<>
    <h2 className="text-2xl text-text font-bold mb-4 bg-dark w-full text-center rounded-lg p-4">Trade Info</h2>
      <motion.div
      className="trade-info flex flex-col md:flex-row justify-center items-center bg-dark text-light p-4 rounded-lg w-full "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      {stats && (
        <div className="mb-4 w-full md:w-1/3 flex flex-col self-start">
          <h3 className="text-text text-xl font-bold mb-2 ">Stats 24h</h3>
          <p className="text-text text-l my-1"><strong>Letzter Preis: </strong>{stats.lastPrice.toFixed(2)} $</p>
          <p className="text-text text-l my-1"><strong>Preisänderung: </strong><span className={`${stats.priceChangePercent < 0 ? "text-red-500":""}`}>{stats.priceChangePercent} %</span></p>
          <p className="text-text text-l my-1"><strong>Höchster Preis: </strong>{stats.highPrice.toFixed(2)} $</p>
          <p className="text-text text-l my-1"><strong>Niedrigster Preis: </strong>{stats.lowPrice.toFixed(2)} $</p>
          <p className="text-text text-l my-1"><strong>Volumen: </strong>{stats.volume.toFixed(2)}</p>
        </div>
      )}
      <div className="w-full md:w-1/3">   
        <h3 className="text-text text-xl font-bold mb-2">Letzte Trades</h3>
        <ul className="space-y-1">
          {trades.map((trade, index) => (
            <li
              key={index}
              className={`flex justify-between p-2 rounded text-sm ${
                trade.isBuyerMaker ? "bg-red-700" : "bg-green-700"
              }`}
            >
              <span>{new Date(trade.time).toLocaleTimeString()}</span>
              <span>{trade.price.toFixed(2)}</span>
              <span>{trade.qty.toFixed(5)}</span>
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
