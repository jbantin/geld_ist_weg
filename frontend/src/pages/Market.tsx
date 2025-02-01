import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { DefaultContext } from "../context/DefaultContext";
import useFormatNumber from "../hooks/useFormatNumber"; // Neuer Import

interface Coin {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
}

const Market: React.FC = () => {
  const { setSelectedCoin } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [sortBy, setSortBy] = useState<"priceChangePercent" | "marketCap">(
    "priceChangePercent"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const selectedCoins = [
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "SOLUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "LINKUSDT",
    "LTCUSDT",
    "BNBUSDT",
    "XLMUSDT",
    "POLUSDT",
    "UNIUSDT",
    "DOTUSDT",
    "ICPUSDT",
    "VETUSDT",
    "FILUSDT",
    "TRXUSDT",
    "ETCUSDT",
  ];
  const navigate = useNavigate();

  // Neues Logo-Mapping hinzufügen:
  const coinLogos: { [key: string]: string } = {
    BTCUSDT: "https://assets.coincap.io/assets/icons/btc@2x.png",
    ETHUSDT: "https://assets.coincap.io/assets/icons/eth@2x.png",
    XRPUSDT: "https://assets.coincap.io/assets/icons/xrp@2x.png",
    SOLUSDT: "https://assets.coincap.io/assets/icons/sol@2x.png",
    DOGEUSDT: "https://assets.coincap.io/assets/icons/doge@2x.png",
    ADAUSDT: "https://assets.coincap.io/assets/icons/ada@2x.png",
    LINKUSDT: "https://assets.coincap.io/assets/icons/link@2x.png",
    LTCUSDT: "https://assets.coincap.io/assets/icons/ltc@2x.png",
    BNBUSDT: "https://assets.coincap.io/assets/icons/bnb@2x.png",
    XLMUSDT: "https://assets.coincap.io/assets/icons/xlm@2x.png",
    POLUSDT: "https://assets.coincap.io/assets/icons/matic@2x.png",
    UNIUSDT: "https://assets.coincap.io/assets/icons/uni@2x.png",
    DOTUSDT: "https://assets.coincap.io/assets/icons/dot@2x.png",
    ICPUSDT: "https://assets.coincap.io/assets/icons/icp@2x.png",
    VETUSDT: "https://assets.coincap.io/assets/icons/vet@2x.png",
    FILUSDT: "https://assets.coincap.io/assets/icons/fil@2x.png",
    TRXUSDT: "https://assets.coincap.io/assets/icons/trx@2x.png",
    ETCUSDT: "https://assets.coincap.io/assets/icons/etc@2x.png",
  };

  const fetch24HourStats = async () => {
    try {
      const res = await fetch("https://api.binance.com/api/v3/ticker/24hr");
      const data = await res.json();
      const filteredCoins = data
        .filter((coin: any) => selectedCoins.includes(coin.symbol))
        .map((coin: any) => ({
          symbol: coin.symbol,
          lastPrice: parseFloat(coin.lastPrice),
          priceChangePercent: parseFloat(coin.priceChangePercent),
          highPrice: parseFloat(coin.highPrice),
          lowPrice: parseFloat(coin.lowPrice),
          volume: parseFloat(coin.volume),
          quoteVolume: parseFloat(coin.quoteVolume),
        }));
      setCoins(filteredCoins);
    } catch (error) {
      console.error("Fehler beim Abrufen der 24-Stunden Statistiken:", error);
    }
  };

  useEffect(() => {
    fetch24HourStats();
    const intervalId = setInterval(fetch24HourStats, 60000); // 1 Minute

    return () => clearInterval(intervalId);
  }, []);

  const handleCoinClick = (symbol: string) => {
    setSelectedCoin(symbol);
    navigate("/trade");
  };

  const handleSort = (criteria: "priceChangePercent" | "marketCap") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "marketCap") {
      return (a.quoteVolume - b.quoteVolume) * order;
    }
    return (a.priceChangePercent - b.priceChangePercent) * order;
  });

  // Neue Arrays für Top-3 Coins
  const topChangeCoins = [...coins]
    .sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    .slice(0, 3);
  const topVolumeCoins = [...coins]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3);

  const formatNumber = useFormatNumber();

  // Aggregierte Kennzahlen für den gesamten Markt berechnen
  const marketAvgChange =
    coins.length > 0
      ? coins.reduce((sum, coin) => sum + coin.priceChangePercent, 0) /
        coins.length
      : 0;
  const marketTotalVolume =
    coins.length > 0 ? coins.reduce((sum, coin) => sum + coin.volume, 0) : 0;

  return (
    <motion.div
      className="w-full h-full p-4 bg-dark text-swich overflow-auto custom-scrollbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4 text-swich text-center">
        Market Overview
      </h2>

      <section className="lg:flex justify-between">
        <div className="">
          <h3 className="md:text-lg font-bold mb-2 text-center text-swich">
            Top 3{" "}
          </h3>
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
                    <span className="font-bold text-lg">
                      {coin.symbol.slice(0, -4)}
                    </span>
                    <br />
                  </div>
                  <span className="text-sm ml-auto">
                    {formatNumber(coin.lastPrice)} $
                  </span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs">
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
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>
        {/* Neue Sektion für aggregierte Marktdaten */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-8 text-swich">Gesamter Markt</h3>
          <div className="p-4 btn-bg rounded-lg max-w-fit m-auto">
            <p className="text-base font-bold">
              Durchschnitt 24h:{" "}
              <span
                className={
                  marketAvgChange < 0 ? "text-red-600" : "text-green-500"
                }
              >
                {useFormatNumber()(marketAvgChange)} %
              </span>
            </p>
            <p className="text-base font-bold">
              Gesamtvolumen: {useFormatNumber()(marketTotalVolume / 1e6)} B
            </p>
          </div>
        </div>
        <div className="">
          <h3 className="text-lg font-bold mb-2 text-center text-swich">
            Top 3{" "}
          </h3>
          <p className="text-center">Volumen</p>
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
                    <span className="font-bold text-lg">
                      {coin.symbol.slice(0, -4)}
                    </span>
                  </div>
                  <span className="text-base ml-auto">
                    {formatNumber(coin.lastPrice)} $
                  </span>

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
      </section>

      <div className="flex justify-between mb-4">
        <Button
          className="mr-2 text-swich p-2 btn-bg text-s md:text-lg md:font-bold"
          onClick={() => handleSort("priceChangePercent")}
        >
          Sort by 24h Change
        </Button>
        <Button
          className="text-swich p-2 btn-bg text-s md:text-lg md:font-bold"
          onClick={() => handleSort("marketCap")}
        >
          Sort by Marketcap
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
                  className="w-12 h-12 m-auto mr-4"
                />
              )}
              <div className="w-full">
                <div className="flex items-center">
                  <span className="font-bold ml-4 text-lg place-self-center">
                    {coin.symbol.slice(0, -4)}
                  </span>
                  <span className="text-lg ml-auto md:font-bold">
                    {formatNumber(coin.lastPrice)} $
                  </span>
                </div>
                <hr className="m-2" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-center ">
                    24h:
                    <span
                      className={`text-xs ${
                        coin.priceChangePercent < 0
                          ? "text-red-600"
                          : "text-green-500"
                      }`}
                    >
                      {" "}
                      <br />
                      {formatNumber(coin.priceChangePercent)} %
                    </span>
                  </span>
                  <span className="text-xs text-center">
                    High:
                    <br /> {formatNumber(coin.highPrice)} $
                  </span>
                  <span className="text-xs text-center">
                    Low: <br />
                    {formatNumber(coin.lowPrice)} $
                  </span>
                  <span className="text-xs text-center">
                    Volume:
                    <br /> {formatNumber(coin.volume / 1e6)} B
                  </span>
                  <span className="text-xs text-right ">
                    Marketcap: <br />
                    {formatNumber(coin.quoteVolume / 1e6)} B
                  </span>
                </div>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Market;
