import React from 'react';

interface NewsCardProps {
  item: any;
  isNewsPage: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, isNewsPage }) => {
  return (
    <div className={`${isNewsPage ? ` mb-4` : "mb-4 md:max-w-[400px]"} ml-4 p-4 btn-bg rounded inline-flex flex-col min-w-[200px] text-swich`}>
      <div className="flex items-center mb-2 ">
        <img src={item.thumb} alt={item.name} className=" mr-4" />
        <div>
          <h3 className="text-xl font-bold">{item.name} ({item.symbol})</h3>
          <span className="text-sm text-swich">Rank: {item.market_cap_rank}</span>
          <span><img src={item.data.sparkline} alt="sparkline" className="mt-2 h-5 opacity-75" /></span>
        </div>
      </div>
      <p>{item.data.content.description}</p>
      <p className="text-swich mt-2 font-bold">Preis: ${item.data.price.toFixed(2)}</p>
      <p className={`mt-1 font-bold ${item.data.price_change_percentage_24h.usd >= 0 ? 'text-green-500' : 'text-red-600'}`}>
        24h: {item.data.price_change_percentage_24h.usd.toFixed(2)}%
      </p>
    </div>
  );
};

export default NewsCard;
