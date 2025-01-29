import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  price: number;
  quantity: number;
}

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`);
      const data = await response.json();
      const sortedBids = data.bids
        .map((bid: string[]) => ({ price: parseFloat(bid[0]), quantity: parseFloat(bid[1]) }))
        .sort((a: Order, b: Order) => b.quantity - a.quantity)
        .slice(0, 12);
      const sortedAsks = data.asks
        .map((ask: string[]) => ({ price: parseFloat(ask[0]), quantity: parseFloat(ask[1]) }))
        .sort((a: Order, b: Order) => b.quantity - a.quantity)
        .slice(0, 12)
        .reverse();
      setBids(sortedBids);
      setAsks(sortedAsks);
    } catch (error) {
      console.error('Fehler beim Abrufen des Orderbuchs:', error);
    }
  };

  useEffect(() => {
    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 1000); 

    return () => clearInterval(intervalId);
  }, [symbol]);

  const maxQuantity = Math.max(
    ...bids.map((bid) => bid.quantity),
    ...asks.map((ask) => ask.quantity)
  );

  return (
    <motion.div
      className="order-book bg-dark text-text p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-sm w-70 font-bold mb-4">Order Book</h2>
      <div className="flex flex-col">
        <div className="mb-4">
          <ul className="space-y-1 relative">
            {bids.map((bid, index) => (
              <li key={index} className="flex justify-between relative text-sm px-1">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 opacity-50 rounded-r-sm"
                  style={{ width: `${(bid.quantity / maxQuantity) * 100}%` }}
                ></div>
                <span className="relative z-10 ">{bid.price.toFixed(2)} $</span>
                <span className="relative z-10">{bid.quantity.toFixed(4)} {symbol.slice(0,3)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="space-y-1 relative">
            {asks.map((ask, index) => (
              <li key={index} className="flex justify-between relative text-sm px-1">
                <div
                  className="absolute left-0 top-0 h-full bg-red-500 opacity-50 "
                  style={{ width: `${(ask.quantity / maxQuantity) * 100}%` }}
                ></div>
                <span className="relative z-10 ">{ask.price.toFixed(2)} $</span>
                <span className="relative z-10">{ask.quantity.toFixed(4)} {symbol.slice(0,3)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderBook;