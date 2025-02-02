import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import NewsCard from '../components/NewsCard';

const News: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [showNews, ] = useState<boolean>(true);
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

  const isTradePage = location.pathname === "/trade";
  const isNewsPage = location.pathname === "/news";

  return (
    <motion.section
      className={`news-feed ${isNewsPage ? 'mx-auto w-full' : 'w-full md:w-1/4 min-w-0'} flex flex-col max-h-[80vh] pt-4 bg-dark text-swich`}
      initial={{ x: isTradePage ? 250 : 0 }}
      animate={{ x: 0 }}      
      transition={{ duration: 1 }}
    >
     
      {showNews && (
        <div className={`grid ${isNewsPage ? 'grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1' : ''} overflow-y-scroll custom-scrollbar pr-2`}>
          {news.filter(item => item.data.content).map((item) => (
            <NewsCard key={item.id} item={item} isNewsPage={isNewsPage} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default News;