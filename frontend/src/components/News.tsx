import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  data: {
    price: number;
    price_change_percentage_24h: {
      usd: number;
    };
    market_cap: string;
    total_volume: string;
    content: {
      title: string;
      description: string;
    };
  };
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/search/trending")
      .then((res) => res.json())
      .then((data) => setNews(data.coins.map((coin: any) => coin.item)));
  }, []);

  return (
    <div className="news-feed w-1/5">
      <h2 className="text-2xl font-bold mb-4">Nachrichten</h2>
      <ul>
        {news.map((item) => (
          <li key={item.id} className="mb-4 p-4 bg-zinc-800 rounded-lg">
            <div className="flex items-center mb-2">
              <img src={item.thumb} alt={item.name} className="w-10 h-10 mr-4" />
              <div>
                <h3 className="text-xl font-bold">{item.name} ({item.symbol})</h3>
                <p className="text-sm text-gray-400">Rank: {item.market_cap_rank}</p>
              </div>
            </div>
            {item.data.content && (
              <>
                <p className="text-gray-300">{item.data.content.description}</p>
                <p className="text-gray-400 mt-2">Preis: ${item.data.price.toFixed(2)}</p>
                <p className={`mt-1 ${item.data.price_change_percentage_24h.usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  24h Änderung: {item.data.price_change_percentage_24h.usd.toFixed(2)}%
                </p>
                <p className="text-gray-400 mt-2">Marktkapitalisierung: {item.data.market_cap}</p>
                <p className="text-gray-400">Volumen: {item.data.total_volume}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default News;
