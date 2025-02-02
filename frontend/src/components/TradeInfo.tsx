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

const formatNumber = (num: number) => {
  return num.toLocaleString('de-DE');
};

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
    <h2 className="text-2xl text-swich font-bold mb-4 bg-dark w-full text-center rounded-lg p-4">Trade Info</h2>
      <motion.div
      className="trade-info flex flex-col md:flex-row justify-center gap-4 items-center bg-dark text-swich p-4 rounded-lg w-full "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      >
      {stats && (
        <div className="mb-4 h-full w-full md:w-1/3 flex flex-col justify-center self-start btn-bg p-4 rounded-lg shadow-lg">
          <h3 className="text-swich text-xl font-bold mb-2 ">Stats 24h</h3>
          <p className="text-swich text-l my-1">
            <strong>Last Price: </strong>{formatNumber(stats.lastPrice)} $ {/* geändert */}
          </p>
          <p className="text-swich text-l my-1">
            <strong>Price Change: </strong>
            <span className={`${stats.priceChangePercent < 0 ? "text-red-600":""}`}>
              {stats.priceChangePercent} % {/* geändert */}
            </span>
          </p>
          <p className="text-swich text-l my-1">
            <strong>High Price: </strong>{formatNumber(stats.highPrice)} $ {/* geändert */}
          </p>
          <p className="text-swich text-l my-1">
            <strong>Low Price: </strong>{formatNumber(stats.lowPrice)} $ {/* geändert */}
          </p>
          <p className="text-swich text-l my-1">
            <strong>Volume: </strong>{formatNumber(stats.volume)} {/* geändert */}
          </p>
        </div>
      )}
      <div className="mb-4 w-full h-full md:w-1/3 flex flex-col self-start btn-bg p-4 rounded-lg shadow-lg">   
        <h3 className="text-swich text-xl font-bold mb-2">Recent Trades</h3> {/* geändert */}
        <ul className="space-y-1">
          {trades.map((trade, index) => (
            <li
              key={index}
              className={`flex justify-between p-2 rounded text-sm ${
                trade.isBuyerMaker ? "bg-red-700" : "bg-green-700"
              }`}
            >
              <span>{new Date(trade.time).toLocaleTimeString()}</span>
              <span>{formatNumber(trade.price)}</span>
              <span>{trade.qty}</span>
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
