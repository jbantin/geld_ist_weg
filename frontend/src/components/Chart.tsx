import { createChart } from "lightweight-charts";
import { useRef, useEffect, useState, useContext } from "react";
import Button from "./Button";
import OrderBook from "./OrderBook";
import TradeInfo from "./TradeInfo";
import Trading from "./Trading";
import { DefaultContext } from "../context/DefaultContext";
import { motion } from "framer-motion";

const Chart = () => {
  const { selectedCoin, showTradeInfo, setShowTradeInfo } =
    useContext(DefaultContext);
  const container = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [interval, setInterval] = useState("1m");

  const intervals = [
    { label: "Minute", value: "1m" },
    { label: "5 Minuten", value: "5m" },
    { label: "15 Minuten", value: "15m" },
    { label: "Stunde", value: "1h" },
    { label: "4 Stunden", value: "4h" },
    { label: "Tag", value: "1d" },
    { label: "Woche", value: "1w" },
    { label: "Monat", value: "1M" },
  ];

  const initializeChart = () => {
    if (container.current) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      const chartBgColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color').trim();
      const chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim();
      if (!chartBgColor || !chartTextColor) {
        console.error("Invalid chart colors");
        return;
      }
      const chart = createChart(container.current, {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.65,
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
        chartRef.current.resize(
          window.innerWidth * 0.6,
          window.innerHeight * 0.6
        );
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
  }, [window.innerHeight, window.innerWidth]);

  useEffect(() => {
    if (!showTradeInfo) {
      initializeChart();
    }
  }, [showTradeInfo, interval]);

  useEffect(() => {
    initializeChart();
  }, [document.documentElement.getAttribute('data-theme')]);

  return (
    <motion.section
      className="flex bg-dark flex-grow w-full flex-col items-center content-center p-4 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="mb-4 flex justify-between w-full space-x-2">
        <div className="flex items-end re">
          <span className="font-bold text-xl p-4 text-green-700 mr-4 bg-light rounded">
            {" "}
            {selectedCoin.slice(0, -4)} in {selectedCoin.slice(-4)}
          </span>
          {intervals.map((int) => (
            <Button
              key={int.value}
              className="bg-secondary text-light hover:underline m-1"
              onClick={() => setInterval(int.value)}
            >
              {int.label}
            </Button>
          ))}
        </div>
        <Button
          className="bg-secondary text-light hover:underline m-1"
          onClick={() => setShowTradeInfo(!showTradeInfo)}
        >
          {showTradeInfo ? "Show Chart" : "Show 24h Stats & Trades"}
        </Button>
      </div>
      <motion.div
        className="flex flex-col w-full h-full items-center content-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showTradeInfo ? (
          <TradeInfo symbol={selectedCoin} />
        ) : (
          <>
            <div className="flex h-full rounded w-full overflow-hidden">
              <OrderBook symbol={selectedCoin} />
              <div
                className="flex justify-center p-4 bg-dark h-full w-full"
                ref={container}
              ></div>
            </div>

            <Trading />
          </>
        )}
      </motion.div>
    </motion.section>
  );
};

export default Chart;
