import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import { DefaultContext } from "../context/DefaultContext";
import useFormatNumber from "../hooks/useFormatNumber"; 
import MarketSummary from "../components/market/MarketSummary";
import MarketCoinGrid from "../components/market/MarketCoinGrid"; 
import { Loader } from "../components/ui/Loading_spinner";

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

const Market: React.FC = () => {
  const { setSelectedCoin, selectedCoins } = useContext(DefaultContext);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [sortBy, setSortBy] = useState<"priceChangePercent" | "marketCap">(
    "priceChangePercent"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  // Neues Logo-Mapping mit allen Coins:
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
    EOSUSDT: "https://assets.coincap.io/assets/icons/eos@2x.png",  
    AAVEUSDT: "https://assets.coincap.io/assets/icons/aave@2x.png",  
    XTZUSDT: "https://assets.coincap.io/assets/icons/xtz@2x.png",    
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
          bidQty: parseFloat(coin.bidQty), 
          askQty: parseFloat(coin.askQty),
        }));
      setCoins(filteredCoins);
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Abrufen der 24-Stunden Statistiken:", error);
      setLoading(false); 
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
  // Neu: Gesamt Marktkapitalisierung als Summe aller quoteVolume
  const aggregatedMarketCap =
    coins.length > 0 ? coins.reduce((sum, coin) => sum + coin.quoteVolume, 0) : 0;
  // Neu: Aggregiertes bid/ask Verhältnis: Summe(bidQty) / Summe(askQty)
  const totalBid = coins.reduce((sum, coin) => sum + coin.bidQty, 0);
  const totalAsk = coins.reduce((sum, coin) => sum + coin.askQty, 0);
  const aggregatedBidAskRatio = totalAsk !== 0 ? totalBid / totalAsk : 0;

  if (loading) { // neu: Loader anzeigen, solange loading true ist
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      className="w-full p-4 bg-dark text-swich "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4 text-swich text-center">
        Market Overview
      </h2>

      <MarketSummary
        topChangeCoins={topChangeCoins}
        topVolumeCoins={topVolumeCoins}
        marketAvgChange={marketAvgChange}
        marketTotalVolume={marketTotalVolume}
        aggregatedMarketCap={aggregatedMarketCap}         
        aggregatedBidAskRatio={aggregatedBidAskRatio}         
        coinLogos={coinLogos}
        formatNumber={formatNumber}
        handleCoinClick={handleCoinClick}
      />

      <div className="flex justify-between mb-4">
        <Button
          className="pl-4 text-swich p-2 btn-bg text-s md:text-lg md:font-bold"
          onClick={() => handleSort("priceChangePercent")}
        >
          Sort by 24h Change
        </Button>
        <Button
          className="text-swich p-2 pr-4 btn-bg text-s md:text-lg md:font-bold"
          onClick={() => handleSort("marketCap")}
        >
          Sort by Market Cap 
        </Button>
      </div>
      
      {/* Nutzung der ausgelagerten MarketCoinGrid-Komponente */}
      <MarketCoinGrid
        sortedCoins={sortedCoins}
        coinLogos={coinLogos}
        handleCoinClick={handleCoinClick}
        formatNumber={formatNumber}
      />
    </motion.div>
  );
};

export default Market;
