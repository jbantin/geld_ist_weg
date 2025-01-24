import { useEffect, useState } from "react";

interface Article {
  symbol: string;
  lastPrice: string;
}

const News = () => {
  const [news, setNews] = useState<Article[]>([]);

  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then((data) => setNews(data));
  }, []);

  return (
    <div className="news-feed">
      <h2 className="text-2xl font-bold mb-4">Nachrichten</h2>
      <ul>
        {news.map((article, index) => (
          <li key={index} className="mb-2">
            <a href={`https://www.binance.com/en/trade/${article.symbol}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {article.symbol}: {article.lastPrice}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
