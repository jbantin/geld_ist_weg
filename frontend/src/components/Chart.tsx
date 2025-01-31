import { createChart } from "lightweight-charts";
import { useRef, useEffect, useContext } from "react";
import ChartControls from "./ChartControls";
import OrderBook from "./OrderBook";
import TradeInfo from "./TradeInfo";
import Trading from "./Trading_inputs";
import { DefaultContext } from "../context/DefaultContext";
import { motion } from "framer-motion";
import News from "../pages/News";

const Chart = () => {
  const {
    selectedCoin,
    showTradeInfo,
    coins,
    interval,
    showNews,
    showOrderBook,
  } = useContext(DefaultContext);
  const container = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  const updateChart = async () => {
    if (chartRef.current && candlestickSeriesRef.current && volumeSeriesRef.current) {
      const limit = interval === "1m" ? 400 : 600;
      try {
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=${interval}&limit=${limit}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const candleData = data.map((data: any) => ({
          time: data[0] / 1000,
          open: parseFloat(data[1]),
          high: parseFloat(data[2]),
          low: parseFloat(data[3]),
          close: parseFloat(data[4]),
        }));
        const volumeData = data.map((data: any) => ({
          time: data[0] / 1000,
          value: parseFloat(data[5]),
          color: parseFloat(data[4]) > parseFloat(data[1]) ? '#26a651' : '#ef5350',
        }));
        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Kerzendaten:", error);
      }
    }
  };

  useEffect(() => {
    const resizeHandler = () => {
      if (chartRef.current && container.current) {
        const chartHeight = Math.max(container.current.clientHeight , 400); // Ensure height is at least 400px
        chartRef.current.resize(
          container.current.clientWidth - 20, // Adjust width to ensure the entire value is visible
          chartHeight,
        );
      }
    };

    window.addEventListener("resize", resizeHandler);

    if (!chartRef.current && container.current) {
      const chartBgColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-bg-color').trim() || '#27272A';
      const chartTextColor = getComputedStyle(document.documentElement).getPropertyValue('--chart-text-color').trim() || '#DDD';
      const chartHeight = Math.max(container.current.clientHeight - 40, 400); // Ensure height is at least 400px
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
      candlestickSeriesRef.current = chart.addCandlestickSeries({
        upColor: "#26a651",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a651",
        wickDownColor: "#ef5350",
      });
      volumeSeriesRef.current = chart.addHistogramSeries({
        color: '#26a651',
        priceFormat: { type: 'volume' },
        priceScaleId: 'vol', // optional ein Custom-ID
      });
      chart.priceScale('vol').applyOptions({
        scaleMargins: {
          top: 0.95,
          bottom: 0,
        },
      });
      chart.timeScale().fitContent();
    }

    updateChart();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [window.innerHeight, window.innerWidth, showOrderBook]);

  useEffect(() => {
    if (!showTradeInfo) {
      updateChart();
    }
  }, [showTradeInfo, interval, selectedCoin]);

  useEffect(() => {
    updateChart();
  }, [document.documentElement.getAttribute('data-theme')]);

  useEffect(() => {
    updateChart();
  }, [coins]);

  return (
    <motion.section
      className="flex flex-col md:flex-col bg-dark flex-grow items-center content-center "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <ChartControls />
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
              className={`flex justify-center p-4 bg-dark h-full w-full min-h-[400px] max-h-[90vh]`}
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
