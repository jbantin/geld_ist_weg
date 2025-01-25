import { useEffect, useState } from "react";

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

  return (
    <div className="trade-info bg-zinc-800 text-white p-4 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">24h Stats & Letzte Trades</h2>
      {stats && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">24h Stats</h3>
          <p>Letzter Preis: {Number(stats.lastPrice).toFixed(2)}</p>
          <p>Preisänderung: {stats.priceChangePercent}%</p>
          <p>Höchster Preis: {Number(stats.highPrice).toFixed(2)}</p>
          <p>Niedrigster Preis: {Number(stats.lowPrice).toFixed(2)}</p>
          <p>Volumen: {Number(stats.volume).toFixed(2)}</p>
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold mb-2">Letzte Trades</h3>
        <ul className="space-y-1">
          {trades.map((trade, index) => (
            <li key={index} className="flex justify-between">
              <span>{new Date(trade.time).toLocaleTimeString()}</span>
              <span>{Number(trade.price).toFixed(2)}</span>
              <span>{Number(trade.qty).toFixed(5)}</span>
              <span>{trade.isBuyerMaker ? "Sell" : "Buy"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TradeInfo;
