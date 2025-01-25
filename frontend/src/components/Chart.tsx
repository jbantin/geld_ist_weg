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

  const initializeChart = () => {
    if (container.current) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      const chart = createChart(container.current, {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.65,
        layout: {
          background: { color: "#27272A" },
          textColor: "#DDD",
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

      const fetchData = () => {
        if (chartRef.current) {
          const limit = interval === "1m" ? 400 : 600; // Begrenze die Anzahl der Kerzen für das 1-Minuten-Intervall
          fetch(
            `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=${interval}&limit=${limit}`
          )
            .then((res) => res.json())
            .then((data) => {
              const candleData = data.map((data: any) => ({
                time: data[0] / 1000,
                open: parseFloat(data[1]),
                high: parseFloat(data[2]),
                low: parseFloat(data[3]),
                close: parseFloat(data[4]),
              }));
              candlestickSeries.setData(candleData);
            });
        }
      };

      fetchData();
      const intervalId = window.setInterval(fetchData, 500);

      return () => {
        window.clearInterval(intervalId);
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
  }, [container, interval, selectedCoin]);

  useEffect(() => {
    if (!showTradeInfo) {
      initializeChart();
    }
  }, [showTradeInfo, interval]);

  return (
    <motion.div
      className="flex flex-grow w-full flex-col items-center content-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex justify-between w-full space-x-2">
        <div>
        <span className="font-bold text-xl p-4 text-green-700 mr-4 bg-zinc-800 rounded"> {selectedCoin.slice(0,-4)} in {selectedCoin.slice(-4)}</span>
        <Button className="bg-zinc-700 hover:underline mr-1" onClick={() => setInterval("1m")}>Minute</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("5m")}>5 Minuten</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("15m")}>15 Minuten</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("1h")}>Stunde</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("4h")}>4 Stunden</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("1d")}>Tag</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("1w")}>Woche</Button>
        <Button className="bg-zinc-700 hover:underline m-1" onClick={() => setInterval("1M")}>Monat</Button>
        </div>
        <Button className="bg-zinc-700 hover:underline" onClick={() => setShowTradeInfo(!showTradeInfo)}>
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
              <div className="flex justify-center p-4 bg-zinc-800 h-full w-full" ref={container}></div>
            </div>

            <Trading />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Chart;
