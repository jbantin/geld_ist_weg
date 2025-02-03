import { createContext, useState, } from "react";

import useInterval from "../hooks/useInterval";
import { ReactNode } from "react";

interface Coin {
  symbol: string;
  price: number;
}

interface DefaultContextProps {
  selectedCoin: string;
  setSelectedCoin: React.Dispatch<React.SetStateAction<string>>;
  showNews: boolean;
  setShowNews: React.Dispatch<React.SetStateAction<boolean>>;
  showTradeInfo: boolean;
  setShowTradeInfo: React.Dispatch<React.SetStateAction<boolean>>;
  coins: Coin[];
  updatePrices: () => void;
  interval: string;
  setInterval: React.Dispatch<React.SetStateAction<string>>;
  isIntervalMenuOpen: boolean;
  setIsIntervalMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showOrderBook: boolean;
  setShowOrderBook: (show: boolean) => void;
  selectedCoins: string[];
  setSelectedCoins: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DefaultContext = createContext<DefaultContextProps>({
  selectedCoin: "BTCUSDT",
  setSelectedCoin: () => {},
  showNews: true,
  setShowNews: () => {},
  showTradeInfo: false,
  setShowTradeInfo: () => {},
  coins: [],
  updatePrices: () => {},
  interval: "1m",
  setInterval: () => {},
  isIntervalMenuOpen: false,
  setIsIntervalMenuOpen: () => {},
  showOrderBook: false,
  setShowOrderBook: () => {},
  selectedCoins: [],
  setSelectedCoins: () => {},
});

interface DefaultContextProviderProps {
  children: ReactNode;
}

export function DefaultContextProvider({
  children,
}: DefaultContextProviderProps) {
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");
  const [showNews, setShowNews] = useState(true);
  const [showTradeInfo, setShowTradeInfo] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [interval, setIntervalState] = useState("1m");
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [isIntervalMenuOpen, setIsIntervalMenuOpen] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState([
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "SOLUSDT",
    "DOGEUSDT",
    "ADAUSDT",
    "LINKUSDT",
    "LTCUSDT",
    "XLMUSDT",
    "POLUSDT",
    "UNIUSDT",
    "DOTUSDT",
    "ICPUSDT",
    "VETUSDT",
    "FILUSDT",
    "TRXUSDT",
    "ETCUSDT",
    "EOSUSDT",
    "AAVEUSDT",
    "XTZUSDT",

  ]);

  const fetchPrices = async () => {
    try {
      const res = await fetch("https://api.binance.com/api/v3/ticker/price");
      const data = await res.json();
      const formattedData = data.map((coin: any) => ({
        symbol: coin.symbol,
        price: parseFloat(coin.price),
      }));
      setCoins(formattedData);
    } catch (error) {
      console.error('Fehler beim Abrufen der Preise:', error);
    }
  };

  
  useInterval(fetchPrices, 2000);

  const data = {
    selectedCoin,
    setSelectedCoin,
    showNews,
    setShowNews,
    showTradeInfo,
    setShowTradeInfo,
    coins,
    updatePrices: fetchPrices,
    interval,
    setInterval: setIntervalState,
    isIntervalMenuOpen,
    setIsIntervalMenuOpen,
    showOrderBook,
    setShowOrderBook,
    selectedCoins,
    setSelectedCoins,
  };

  return (
    <DefaultContext.Provider value={data}>{children}</DefaultContext.Provider>
  );
}
