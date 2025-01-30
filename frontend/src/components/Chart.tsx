import { createChart } from "lightweight-charts";
import { useRef, useEffect, useState, useContext } from "react";
import Button from "./Button";
import OrderBook from "./OrderBook";
import TradeInfo from "./TradeInfo";
import Trading from "./Trading";
import { DefaultContext } from "../context/DefaultContext";
import { motion } from "framer-motion";
import News from "./News";

const Chart = () => {
  const { selectedCoin, showTradeInfo, setShowTradeInfo } =
    useContext(DefaultContext);
  const container = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [interval, setInterval] = useState("1m");
  const [showNews, setShowNews] = useState(true);
  const [showOrderBook, setShowOrderBook] = useState(true);
  const [isIntervalMenuOpen, setIsIntervalMenuOpen] = useState(false);

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

  const initializeChart = () => {
    if (container.current) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      const chartBgColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color').trim() || '#27272A';
      const chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim() || '#DDD';
      if (!chartBgColor || !chartTextColor) {
        console.error("Invalid chart colors");
        return;
      }
      const chartHeight = Math.max(container.current.clientHeight - 150, 400); // Ensure height is at least 400px
      const chart = createChart(container.current, {
        width: container.current.clientWidth - 20, // Adjust width to ensure the entire value is visible
        height: chartHeight,
        layout: {
          background: { color: chartBgColor },
          textColor: chartTextColor,
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: "#444",
          rightOffset: 1,
        },
      });
      chartRef.current = chart;
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a651",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a651",
        wickDownColor: "#ef5350",
      });

      chart.timeScale().fitContent();

      const fetchData = async () => {
        if (chartRef.current) {
          const limit = interval === "1m" ? 400 : 600;
          try {
            const res = await fetch(
              `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=${interval}&limit=${limit}`
            );
            const data = await res.json();
            const candleData = data.map((data: any) => ({
              time: data[0] / 1000,
              open: parseFloat(data[1]),
              high: parseFloat(data[2]),
              low: parseFloat(data[3]),
              close: parseFloat(data[4]),
            }));
            candlestickSeries.setData(candleData);
          } catch (error) {
            console.error("Fehler beim Abrufen der Kerzendaten:", error);
          }
        }
      };

      fetchData();

      return () => {
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        if (container.current) {
          const chartHeight = Math.max(container.current.clientHeight - 150, 400); // Ensure height is at least 400px
          chartRef.current.resize(
            container.current.clientWidth - 20, // Adjust width to ensure the entire value is visible
            chartHeight,
          );
        }
      }
    };

    window.addEventListener("resize", handleResize);

    initializeChart();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [window.innerHeight, window.innerWidth, showOrderBook]);

  useEffect(() => {
    if (!showTradeInfo) {
      initializeChart();
    }
  }, [showTradeInfo, interval, selectedCoin]);

  useEffect(() => {
    initializeChart();
  }, [document.documentElement.getAttribute('data-theme')]);

  return (
    <motion.section
      className="flex flex-col md:flex-col bg-dark flex-grow w-full items-center content-center "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="mb-4 flex justify-between w-full space-x-2">
        <div className="flex items-end ">
          <span className="font-bold text-xl p-4 text-green-700 mr-4 bg-light rounded">
            {" "}
            {selectedCoin.slice(0, -4)} in {selectedCoin.slice(-4)}
          </span>
          <div className="hidden md:flex">
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
              <div className="absolute top-50 left-0 p-4 w-full bg-dark flex items-center z-100 md:hidden">
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
      <motion.div
        className="flex flex-col md:flex-col w-full h-full items-center content-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showTradeInfo ? (
          <TradeInfo symbol={selectedCoin} />
        ) : (
          <div className="flex flex-col md:flex-row h-full rounded-2xl w-full overflow-hidden ">
            {showOrderBook && <OrderBook symbol={selectedCoin} />}
            <div
              className={`flex justify-center p-4 bg-dark h-full w-full min-h-[400px]`}
              ref={container}
            ></div>
            {showNews && <News />}
          </div>
        )}
        <Trading />
      </motion.div>
    </motion.section>
  );
};

export default Chart;
