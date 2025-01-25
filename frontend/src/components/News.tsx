import React, { useState, useEffect } from 'react';
import Button from './Button'; // Importieren Sie Ihre Button-Komponente
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';

const News: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [showNews, setShowNews] = useState<boolean>(true);
  const location = useLocation();

  const fetchNews = () => {
    fetch("https://api.coingecko.com/api/v3/search/trending")
      .then((res) => res.json())
      .then((data) => setNews(data.coins.map((coin: any) => coin.item)));
  };

  useEffect(() => {
    fetchNews();
    const intervalId = setInterval(fetchNews, 60000); // 1 Minute

    return () => clearInterval(intervalId);
  }, []);

  const isMarketPage = location.pathname === "/market";
  const isNewsPage = location.pathname === "/news";

  return (
    <motion.div
      className={`news-feed ${isNewsPage ? 'mx-auto' : ''} ${isMarketPage ? 'w-1/5' : 'w-full'} flex flex-col max-h-[91vh] pt-4 `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isMarketPage && (
        <Button onClick={() => setShowNews(!showNews)} className="mb-4 bg-zinc-700 hover:underline min-h-12">
          {showNews ? "Hide News" : "Show News"}
        </Button>
      )}
      {showNews && (
        <div className={`grid ${isNewsPage ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1' : ''} overflow-y-scroll custom-scrollbar pr-2`}>
          {news.filter(item => item.data.content).map((item) => (
            <div key={item.id} className={`${isNewsPage ? `m-4` : "mb-4"} p-4 bg-zinc-800 rounded-lg inline-flex flex-col min-w-[200px] max-w-[400px]`}>
              <div className="flex items-center mb-2">
                <img src={item.thumb} alt={item.name} className=" mr-4" />
                <div>
                  <h3 className="text-xl font-bold">{item.name} ({item.symbol})</h3>
                  <span className="text-sm text-gray-400">Rank: {item.market_cap_rank}</span>
                  <span><img src={item.data.sparkline} alt="sparkline" className="mt-2 h-5 opacity-75" /></span>
                </div>
              </div>
              <p className="text-gray-300">{item.data.content.description}</p>
              <p className="text-gray-400 mt-2">Preis: ${item.data.price.toFixed(2)}</p>
              <p className={`mt-1 ${item.data.price_change_percentage_24h.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                24h: {item.data.price_change_percentage_24h.usd.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default News;