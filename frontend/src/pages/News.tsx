import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import NewsCard from '../components/ui/NewsCard';

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
      className={`news-feed ${isNewsPage ? 'mx-auto w-full h-full max-h-[90vh]' : 'w-full md:w-fit md:max-w-100'} md:max-h-[74vh] flex flex-col bg-dark text-swich md:mt-4 mt-8 custom-scrollbar overflow-auto w-full`}
      initial={{ x: isTradePage ? 250 : 0 }}
      animate={{ x: 0 }}      
      transition={{ duration: 1 }}
    >
     
      {showNews && (
        <div className={`  ${isNewsPage ? 'md:columns-2 grid-cols-1  sm:grid-cols-2 lg:columns-3 gap-1' : ''} pr-2`}>
          {news.filter(item => item.data.content).map((item) => (
            <NewsCard key={item.id} item={item} isNewsPage={isNewsPage} />
          ))}
        </div>
      )}
    </motion.section>
  );
};

export default News;