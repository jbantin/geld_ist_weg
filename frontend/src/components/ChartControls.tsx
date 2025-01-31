import { useContext } from "react";
import Button from "./Button";
import { DefaultContext } from "../context/DefaultContext";

const ChartControls = () => {
  const {
    selectedCoin,
    setInterval,
    isIntervalMenuOpen,
    setIsIntervalMenuOpen,
    showTradeInfo,
    setShowTradeInfo,
    showOrderBook,
    setShowOrderBook,
    showNews,
    setShowNews,
  } = useContext(DefaultContext);

  const intervals = [
    { label: "1m", value: "1m" },
    { label: "5m", value: "5m" },
    { label: "15m", value: "15m" },
    { label: "1h", value: "1h" },
    { label: "4h", value: "4h" },
    { label: "1d", value: "1d" },
    { label: "1W", value: "1w" },
    { label: "1M", value: "1M" },
  ];

  return (
    <div className="mb-4 flex justify-between w-full space-x-2">
      <div className="flex items-end ">
        <span className="font-bold text-xl p-4 text-green-700 mr-4 bg-light rounded">
          {" "}
          {selectedCoin.slice(0, -4)} in {selectedCoin.slice(-4)}
        </span>
        <div className="hidden md:flex self-center">
          {intervals.map((int) => (
            <Button
              key={int.value}
              className="bg-secondary text-light hover:scale-105 m-1 p-1 px-2 "
              onClick={() => setInterval(int.value)}
            >
              {int.label}
            </Button>
          ))}
        </div>
        <div className="md:hidden self-center"> {/* mobile */}
          <Button className="bg-secondary text-light hover:underline m-1 p-2" onClick={() => setIsIntervalMenuOpen(!isIntervalMenuOpen)}>
            ☰
          </Button>
          {isIntervalMenuOpen && (
            <div className="absolute top-40 left-0 mt-3 p-4 w-full bg-dark flex items-center z-100 md:hidden">
              {intervals.map((int) => (
                <Button
                  key={int.value}
                  className="bg-secondary text-light hover:underline w-full"
                  onClick={() => {
                    setInterval(int.value);
                    setIsIntervalMenuOpen(false);
                  }}
                >
                  {int.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          className={`m-1 p-2 text-text`}
          onClick={() => setShowTradeInfo(!showTradeInfo)}
        >
          {showTradeInfo ? "Show Chart" : "Show Stats"}
        </Button>
        <Button
          className={`m-1 p-2 ${showOrderBook ? "bg-accent" : "bg-secondary"} text-light hover:underline`}
          onClick={() => setShowOrderBook(!showOrderBook)}
        >
          Order Book
        </Button>
        <Button
          className={`m-1 mr-4 px-4 ${showNews ? "bg-accent" : "bg-secondary"} text-light hover:underline`}
          onClick={() => setShowNews(!showNews)}
        >
          News
        </Button>
      </div>
    </div>
  );
};

export default ChartControls;
