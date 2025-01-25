import { createChart } from "lightweight-charts";
import { useRef, useEffect, useState, useContext } from "react";
import Button from "./Button";
import OrderBook from "./OrderBook";
import TradeInfo from "./TradeInfo";
import Trading from "./Trading";
import { DefaultContext } from "../context/DefaultContext";

const Chart = () => {
  const { selectedCoin, showTradeInfo, setShowTradeInfo } =
    useContext(DefaultContext);
  const container = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [interval, setInterval] = useState("1d");

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(
          window.innerWidth * 0.7,
          window.innerHeight * 0.5
        );
      }
    };

    window.addEventListener("resize", handleResize);

    if (container.current) {
      const chart = createChart(container.current, {
        width: window.innerWidth * 0.6,
        height: window.innerHeight * 0.5,
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
          fetch(
            `https://api.binance.com/api/v3/klines?symbol=${selectedCoin}&interval=${interval}`
          )
            .then((res) => res.json())
            .then((data) => {
              const cdata = data.map((d: any) => ({
                time: d[0] / 1000,
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
              }));
              candlestickSeries.setData(cdata);
            });
        }
      };

      fetchData();
      const intervalId = window.setInterval(fetchData, 500);

      return () => {
        window.clearInterval(intervalId);
        chart.remove();
        chartRef.current = null;
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [container, interval, selectedCoin]);

  return (
    <div className="flex flex-col items-center content-center p-4">
      <div className="mb-4 flex space-x-2">
        <Button onClick={() => setInterval("1m")}>Minute</Button>
        <Button onClick={() => setInterval("5m")}>5 Minuten</Button>
        <Button onClick={() => setInterval("15m")}>15 Minuten</Button>
        <Button onClick={() => setInterval("1h")}>Stunde</Button>
        <Button onClick={() => setInterval("4h")}>4 Stunden</Button>
        <Button onClick={() => setInterval("1d")}>Tag</Button>
        <Button onClick={() => setInterval("1w")}>Woche</Button>
        <Button onClick={() => setInterval("1M")}>Monat</Button>
        <Button onClick={() => setShowTradeInfo(!showTradeInfo)}>
          {showTradeInfo ? "Show Chart & OrderBook" : "Show 24h Stats & Trades"}
        </Button>
      </div>
      <div
        className="rounded-r-lg overflow-hidden flex flex-col"
        style={{ width: "100%", height: "100%" }}
      >
        {showTradeInfo ? (
          <TradeInfo symbol={selectedCoin} />
        ) : (
          <>
            <div className="flex">
              <OrderBook symbol={selectedCoin} />
              <div className="container_chart" ref={container}></div>
            </div>

            <Trading />
          </>
        )}
      </div>
    </div>
  );
};

export default Chart;
