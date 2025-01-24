import { createChart } from "lightweight-charts";
import { useRef, useEffect, useState } from "react";

const Chart = () => {
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
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${interval}`
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
      const intervalId = window.setInterval(fetchData, 200);

      return () => {
        window.clearInterval(intervalId);
        chart.remove();
      };
    }
  }, [container, interval]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={() => setInterval("1m")}>Minute</button>
        <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={() => setInterval("1d")}>Tag</button>
        <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={() => setInterval("1w")}>Woche</button>
        <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1" onClick={() => setInterval("1M")}>Monat</button>
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
