import { createChart } from "lightweight-charts";
import { useRef, useEffect, useState } from "react";
import Button from "./Button";

interface ChartProps {
  selectedCoin: string;
}

const Chart: React.FC<ChartProps> = ({ selectedCoin }) => {
  const container = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState("1d");

  useEffect(() => {
    if (container.current) {
      const chart = createChart(container.current, {
        width: container.current.clientWidth,
        height: container.current.clientHeight,
        layout: {
          background: { color: "#222" },
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
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a651",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a651",
        wickDownColor: "#ef5350",
      });

      chart.timeScale().fitContent();

      const fetchData = () => {
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
      };

      fetchData();
      const intervalId = window.setInterval(fetchData, 500);

      return () => {
        window.clearInterval(intervalId);
        chart.remove();
      };
    }
  }, [container, interval, selectedCoin]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <Button onClick={() => setInterval("1m")}>Minute</Button>
        <Button onClick={() => setInterval("5m")}>5 Minuten</Button>
        <Button onClick={() => setInterval("15m")}>15 Minuten</Button>
        <Button onClick={() => setInterval("1h")}>Stunde</Button>
        <Button onClick={() => setInterval("4h")}>4 Stunden</Button>
        <Button onClick={() => setInterval("1d")}>Tag</Button>
        <Button onClick={() => setInterval("1w")}>Woche</Button>
        <Button onClick={() => setInterval("1M")}>Monat</Button>
      </div>
      <div
        className="container_chart"
        ref={container}
        style={{ width: "600px", height: "400px" }}
      ></div>
    </div>
  );
};

export default Chart;
