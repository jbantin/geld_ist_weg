import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  price: number;
  quantity: number;
}

interface OrderBookProps {
  symbol: string;
}

const formatNumber = (num: number) => {
  return num.toLocaleString('de-DE');
};

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);

  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`);
      const data = await response.json();
      const limit = window.innerWidth < 768 ? 5 : 15 // 5 für mobile Ansicht, 12 für Desktop
      const sortedBids = data.bids
        .map((bid: string[]) => ({ price: parseFloat(bid[0]), quantity: parseFloat(bid[1]) }))
        .sort((a: Order, b: Order) => b.quantity - a.quantity)
        .slice(0, limit);
      const sortedAsks = data.asks
        .map((ask: string[]) => ({ price: parseFloat(ask[0]), quantity: parseFloat(ask[1]) }))
        .sort((a: Order, b: Order) => b.quantity - a.quantity)
        .slice(0, limit)
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
      className="order-book bg-dark text-text p-4 flex flex-col justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-sm max-w-70 min-w-50 font-bold mb-4">Order Book</h2>
      <div className="flex flex-col">
        <div className="mb-4">
          <ul className="space-y-1 relative">
            {bids.map((bid, index) => (
              <li key={index} className="flex justify-between relative text-sm px-1">
                <div
                  className="absolute left-0 top-0 h-full bg-green-500 opacity-50 rounded-r-sm"
                  style={{ width: `${(bid.quantity / maxQuantity) * 100}%` }}
                ></div>
                <span className="relative z-10 ">{formatNumber(bid.price)} $</span>
                <span className="relative z-10">{formatNumber(bid.quantity)} {symbol.slice(0,3)}</span>
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
                <span className="relative z-10 ">{formatNumber(ask.price)} $</span>
                <span className="relative z-10">{formatNumber(ask.quantity)} {symbol.slice(0,3)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderBook;