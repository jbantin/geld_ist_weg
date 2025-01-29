import React, { useState, useEffect } from 'react';
import Button from './Button'; // Importieren Sie Ihre Button-Komponente
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import NewsCard from './NewsCard';

const News: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [showNews, setShowNews] = useState<boolean>(true);
  const location = useLocation();

  const fetchNews = async () => {
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
      const data = await res.json();
      setNews(data.coins.map((coin: any) => coin.item));
    } catch (error) {
      console.error('Fehler beim Abrufen der Nachrichten:', error);
    }
  };

  useEffect(() => {
    fetchNews();
    const intervalId = setInterval(fetchNews, 60000); // 1 Minute

    return () => clearInterval(intervalId);
  }, []);

  const isMarketPage = location.pathname === "/market";
  const isNewsPage = location.pathname === "/news";

  return (
    <motion.section
      className={`news-feed ${isNewsPage ? 'mx-auto w-full' : 'w-full md:w-1/5'} flex flex-col max-h-[70vh] pt-4 bg-dark text-text`}
      initial={{ x: isMarketPage ? 250 : 0 }}
      animate={{ x: 0 }}      
      transition={{ duration: 0.5 }}
    >
      {isMarketPage && (
        <Button onClick={() => setShowNews(!showNews)} className="mb-4 mr-4 bg-secondary text-light hover:underline min-h-12">
          {showNews ? "Hide News" : "Show News"}
        </Button>
      )}
      {showNews && (
        <div className={`grid ${isNewsPage ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1' : ''} overflow-y-scroll custom-scrollbar pr-2`}>
          {news.filter(item => item.data.content).map((item) => (
            <NewsCard key={item.id} item={item} isNewsPage={isNewsPage} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default News;