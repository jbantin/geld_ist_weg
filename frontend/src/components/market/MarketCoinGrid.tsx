import React from "react";
import Button from "../ui/Button";


interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  bidQty: number;
  askQty: number;
}

interface MarketCoinGridProps {
  sortedCoins: Coin[];
  coinLogos: { [key: string]: string };
  handleCoinClick: (symbol: string) => void;
  formatNumber: (num: number) => string;
}

const MarketCoinGrid: React.FC<MarketCoinGridProps> = ({
  sortedCoins,
  coinLogos,
  handleCoinClick,
  formatNumber,
}) => {
  return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-auto custom-scrollbar md:max-h-[55vh] pr-1">
      {sortedCoins.map((coin) => (
        <div key={coin.symbol}>
          <Button
            className="w-full text-left p-4 btn-bg rounded-lg text-s md:text-lg md:font-bold flex"
            onClick={() => handleCoinClick(coin.symbol)}
          >
            {coinLogos[coin.symbol] && (
              <img
                src={coinLogos[coin.symbol]}
                alt={coin.symbol}
                loading="lazy"
                className="w-15 h-15 m-auto mr-4"
              />
            )}
            <div className="w-full">
              <div className="flex w-full">
                <span className="font-bol w-15 ml-4 text-lg">
                  {coin.symbol.slice(0, -4)}
                </span>
                <span className="text-xs text-center m-auto">
                  24h:
                  <span
                    className={`text-xs ${
                      coin.priceChangePercent < 0
                        ? "text-red-600"
                        : "text-green-500"
                    }`}
                  >
                    <br />
                    {formatNumber(coin.priceChangePercent)} %
                  </span>
                </span>
                <span className="text-lg md:font-bold w-40 text-right">
                  {formatNumber(coin.lastPrice)} $
                </span>
              </div>
              <hr className="m-2" />
              <div className="grid grid-cols-4 w-full mt-2">
                <span className="text-xs text-left ml-4">
                  High:
                  <br /> {formatNumber(coin.highPrice)} $
                </span>
                <span className="text-xs text-center">
                  Low: <br /> {formatNumber(coin.lowPrice)} $
                </span>
                <span className="text-xs text-center">
                  Volume:
                  <br /> {formatNumber(coin.volume / 1e6)} B
                </span>
                <span className="text-xs text-right">
                  Market Cap: <br /> {formatNumber(coin.quoteVolume / 1e6)} B
                </span>
              </div>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MarketCoinGrid;
