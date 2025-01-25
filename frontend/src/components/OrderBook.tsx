import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  price: string;
  quantity: string;
}

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  const fetchOrderBook = () => {
    fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`)
      .then((response) => response.json())
      .then((data) => {
        const sortedBids = data.bids
          .map((bid: string[]) => ({ price: bid[0], quantity: bid[1] }))
          .sort((a: Order, b: Order) => parseFloat(b.quantity) - parseFloat(a.quantity))
          .slice(0, 12);
        const sortedAsks = data.asks
          .map((ask: string[]) => ({ price: ask[0], quantity: ask[1] }))
          .sort((a: Order, b: Order) => parseFloat(b.quantity) - parseFloat(a.quantity))
          .slice(0, 12)
          .reverse();
        setBids(sortedBids);
        setAsks(sortedAsks);
      })
      .catch((error) => console.error('Fehler beim Abrufen des Orderbuchs:', error));
  };

  useEffect(() => {
    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 500); // Aktualisiere alle 5 Sekunden

    return () => clearInterval(intervalId);
  }, [symbol]);

  const maxQuantity = Math.max(
    ...bids.map((bid) => parseFloat(bid.quantity)),
    ...asks.map((ask) => parseFloat(ask.quantity))
  );

  return (
    <motion.div
      className="order-book bg-zinc-800 text-white p-4 rounded-l-lg w-50 max-w-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Orderbuch</h2>
      <div className="flex flex-col">
        <div className="mb-4">
          <ul className="space-y-1 relative">
            {bids.map((bid, index) => (
              <li key={index} className="flex justify-between relative text-sm">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 opacity-50"
                  style={{ width: `${(parseFloat(bid.quantity) / maxQuantity) * 100}%` }}
                ></div>
                <span className="relative z-10 ">{Number(bid.price).toFixed(2)} $</span>
                <span className="relative z-10">{Number(bid.quantity).toFixed(4)} {symbol.slice(0,3)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="space-y-1 relative">
            {asks.map((ask, index) => (
              <li key={index} className="flex justify-between relative text-sm">
                <div
                  className="absolute left-0 top-0 h-full bg-red-500 opacity-50 "
                  style={{ width: `${(parseFloat(ask.quantity) / maxQuantity) * 100}%` }}
                ></div>
                <span className="relative z-10 ">{Number(ask.price).toFixed(2)} $</span>
                <span className="relative z-10">{Number(ask.quantity).toFixed(4)} {symbol.slice(0,3)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderBook;