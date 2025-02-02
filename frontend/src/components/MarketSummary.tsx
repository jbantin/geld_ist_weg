import React from "react";
import Button from "./Button";

interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

interface MarketSummaryProps {
  topChangeCoins: Coin[];
  topVolumeCoins: Coin[];
  marketAvgChange: number;
  marketTotalVolume: number;
  aggregatedMarketCap: number;    // neu
  aggregatedBidAskRatio: number;    // neu
  coinLogos: { [key: string]: string };
  formatNumber: (num: number) => string;
  handleCoinClick: (symbol: string) => void;
}

const MarketSummary: React.FC<MarketSummaryProps> = ({
  topChangeCoins,
  topVolumeCoins,
  marketAvgChange,
  marketTotalVolume,
  aggregatedMarketCap,    // neu
  aggregatedBidAskRatio,    // neu
  coinLogos,
  formatNumber,
  handleCoinClick,
}) => {
  return (
    <div className="lg:flex justify-between">
      <div>
        <h3 className="md:text-lg font-bold mb-2 text-center text-swich">Top 3</h3>
        <p className="text-center">24h Change</p>
        <div className="grid grid-cols-3 w-full gap-4 mb-4">
          {topChangeCoins.map((coin) => (
            <div key={coin.symbol}>
              <Button
                className="w-full text-left p-4 btn-bg rounded-lg text-s md:text-lg md:font-bold"
                onClick={() => handleCoinClick(coin.symbol)}
              >
                <div className="flex items-center">
                  {coinLogos[coin.symbol] && (
                    <img
                      src={coinLogos[coin.symbol]}
                      alt={coin.symbol}
                      className="w-8 h-8 mr-2"
                    />
                  )}
                  <span className="font-bold text-lg">{coin.symbol.slice(0, -4)}</span>
                </div>
                <span className="text-sm ml-auto">{formatNumber(coin.lastPrice)} $</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs">
                    24h:
                    <span
                      className={`text-xs ${
                        coin.priceChangePercent < 0 ? "text-red-600" : "text-green-500"
                      }`}
                    >
                      <br />
                      {formatNumber(coin.priceChangePercent)} %
                    </span>
                  </span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-14">
        <div className="p-4 btn-bg rounded-lg max-w-fit m-auto">
          <p className="text-base font-bold">
            Overall 24h:{" "}
            <span className={marketAvgChange < 0 ? "text-red-600" : "text-green-500"}>
              {formatNumber(marketAvgChange)} %
            </span>
          </p>
          <p className="text-base font-bold">
            24h Volume: {formatNumber(marketTotalVolume / 1e6)} B
          </p>
          <p className="text-base font-bold">
            Total Market Cap: {formatNumber(aggregatedMarketCap / 1e6)} B
          </p>
          <p className="text-base font-bold">
            Bid/Ask Ratio: {formatNumber(aggregatedBidAskRatio)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2 text-center text-swich">Top 3</h3>
        <p className="text-center">Volume</p>
        <div className="grid grid-cols-3 w-full gap-4 mb-4">
          {topVolumeCoins.map((coin) => (
            <div key={coin.symbol}>
              <Button
                className="w-full text-left p-4 btn-bg rounded-lg text-s md:text-lg md:font-bold"
                onClick={() => handleCoinClick(coin.symbol)}
              >
                <div className="flex items-center">
                  {coinLogos[coin.symbol] && (
                    <img
                      src={coinLogos[coin.symbol]}
                      alt={coin.symbol}
                      className="w-8 h-8 mr-2"
                    />
                  )}
                  <span className="font-bold text-lg">{coin.symbol.slice(0, -4)}</span>
                </div>
                <span className="text-base ml-auto">{formatNumber(coin.lastPrice)} $</span>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs">
                    Volumen:
                    <br /> {formatNumber(coin.volume / 1e6)} B
                  </span>
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketSummary;
