import { createChart } from "lightweight-charts";
import { useRef, useEffect, useContext, useState } from "react"; // neu
import ChartControls from "./ChartControls";
import OrderBook from "./ChartOrderBook";
import TradeInfo from "./ChartTradeInfo";
import Trading from "./ChartTradingInputs";
import { DefaultContext } from "../../context/DefaultContext";
import { motion } from "framer-motion";
import News from "../../pages/News";
import useResize from "../../hooks/useResize"; 
import { Loader } from "../ui/Loading_spinner"; // neu

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
  const { width, height } = useResize(); // Statt window.innerWidth / innerHeight
  const [loading, setLoading] = useState(true); // neu

  // Neues Farben-Objekt zur zentralen Verwaltung
  const chartColors = {
    background:
      getComputedStyle(document.documentElement)
        .getPropertyValue("--chart-bg-color")
        .trim() || "#27272A",
    text:
      getComputedStyle(document.documentElement)
        .getPropertyValue("--chart-text-color")
        .trim() || "#DDD",
    grid: "#444",
    upColor: "#2EBD85",
    downColor: "#F6465D",
    volumeUpColor: "#26a651",
    volumeDownColor: "#ef5350",
  };

  const updateChart = async () => {
    if (
      chartRef.current &&
      candlestickSeriesRef.current &&
      volumeSeriesRef.current
    ) {
      const limit = interval === "1m" ? 800 : 1000;
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=${interval}&limit=${limit}`
        );
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
          color:
            parseFloat(data[4]) > parseFloat(data[1])
              ? chartColors.upColor
              : chartColors.downColor,
        }));
        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);
      } catch (error) {
        console.error("Fehler beim Abrufen der Kerzendaten:", error);
      }
    }
  };

  const applyTheme = () => {
    if (chartRef.current) {
      chartColors.background =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--chart-bg-color")
          .trim() || "#27272A";
      chartColors.text =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--chart-text-color")
          .trim() || "#DDD";
      chartRef.current.applyOptions({
        layout: {
          background: { color: chartColors.background },
          textColor: chartColors.text,
        },
        grid: {
          vertLines: { color: chartColors.grid },
          horzLines: { color: chartColors.grid },
        },
        timeScale: {
          borderColor: chartColors.grid,
        },
      });
    }
  };

  useEffect(() => {
    const resizeHandler = () => {
      if (chartRef.current && container.current) {
        const chartHeight = Math.max(container.current.clientHeight, 400); 
        chartRef.current.resize(
          container.current.clientWidth - 20, // Adjust width to ensure the entire value is visible
          chartHeight
        );
      }
    };

    window.addEventListener("resize", resizeHandler);

    if (showTradeInfo) {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      window.removeEventListener("resize", resizeHandler);
      return;
    }

    // Chart initialisieren, falls noch nicht vorhanden
    if (!chartRef.current && container.current) {
      const chartHeight = Math.max(container.current.clientHeight - 40, 400); 
      const chart = createChart(container.current, {
        width: container.current.clientWidth - 20, // Adjust width to ensure the entire value is visible
        height: chartHeight,
        layout: {
          background: { color: chartColors.background },
          textColor: chartColors.text,
        },
        grid: {
          vertLines: { color: chartColors.grid },
          horzLines: { color: chartColors.grid },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderColor: chartColors.grid,
          rightOffset: 1,
        },
      });
      chartRef.current = chart;
      candlestickSeriesRef.current = chart.addCandlestickSeries({
        upColor: chartColors.upColor,
        downColor: chartColors.downColor,
        borderVisible: false,
        wickUpColor: chartColors.upColor,
        wickDownColor: chartColors.downColor,
      });
      volumeSeriesRef.current = chart.addHistogramSeries({
        color: chartColors.volumeUpColor,
        priceFormat: { type: "volume" },
        priceScaleId: "vol", // optional ein Custom-ID
      });
      chart.priceScale("vol").applyOptions({
        scaleMargins: {
          top: 0.9,
          bottom: 0,
        },
      });
      chart.timeScale().fitContent();
    
      // Neu: Nach kurzer Verzögerung den Resize-Handler durchführen und Loading beenden
      setTimeout(() => {
        resizeHandler();
        setLoading(false); // neu: Chart initialisiert → Loader ausblenden
      }, 200);
    }
    
    resizeHandler(); 
    updateChart();
    applyTheme();

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [width, height, showOrderBook, showTradeInfo, showNews]); // statt window.innerWidth/innerHeight

  useEffect(() => {
    if (!showTradeInfo) {
      updateChart();
    }
  }, [showTradeInfo, interval, selectedCoin]);

  useEffect(() => {
    applyTheme();
    updateChart();
  }, [document.documentElement.getAttribute("data-theme")]);

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
        className="relative flex flex-col md:flex-col w-full h-full items-center content-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {showTradeInfo ? (
          <TradeInfo symbol={selectedCoin} />
        ) : (
          <div className="flex flex-col max-h-[74vh] md:flex-row md:full rounded-2xl w-full overflow-hidden ">
            {showOrderBook && <OrderBook symbol={selectedCoin} />}
            <div
              className="flex justify-center mt-2 bg-dark h-full w-full min-h-[400px] max-h-[400px] md:max-h-[72vh] md:max-w-[70vw]"
              ref={container}
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader />
                </div>
              )}
            </div>
            {showNews && <News />}
          </div>
        )}
        <Trading />
      </motion.div>
    </motion.section>
  );
};

export default Chart;
