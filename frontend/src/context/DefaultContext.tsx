import { createContext, useState, useEffect } from "react";
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
}

export const DefaultContext = createContext<DefaultContextProps>({
  selectedCoin: "BTCUSDT",
  setSelectedCoin: () => {},
  showNews: true,
  setShowNews: () => {},
  showTradeInfo: false,
  setShowTradeInfo: () => {},
  coins: [],
});

interface DefaultContextProviderProps {
  children: ReactNode;
}

export function DefaultContextProvider({ children }: DefaultContextProviderProps) {
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");
  const [showNews, setShowNews] = useState(true);
  const [showTradeInfo, setShowTradeInfo] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);

  const fetchPrices = () => {
    fetch("https://api.binance.com/api/v3/ticker/price")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((coin: any) => ({
          symbol: coin.symbol,
          price: parseFloat(coin.price),
        }));
        setCoins(formattedData);
      });
  };

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 5000); // Aktualisiere alle 5 Sekunden

    return () => clearInterval(intervalId);
  }, []);

  const data = {
    selectedCoin,
    setSelectedCoin,
    showNews,
    setShowNews,
    showTradeInfo,
    setShowTradeInfo,
    coins,
  };

  return (
    <DefaultContext.Provider value={data}>{children}</DefaultContext.Provider>
  );
}
