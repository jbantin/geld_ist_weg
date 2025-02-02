import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

const ProfileOverview = () => {
  const portfolioData = [
    { label: "Bitcoin (BTC)", value: 60, color: "#F7931A" },
    { label: "Ethereum (ETH)", value: 25, color: "#3C3C3D" },
    { label: "Binance Coin (BNB)", value: 10, color: "#F3BA2F" },
    { label: "Solana (SOL)", value: 5, color: "#00FFA3" },
  ];

  const transactions = [
    {
      date: "02.02.2025",
      type: "Kauf",
      coin: "BTC",
      amount: 0.1,
      price: "$2,000",
    },
    {
      date: "01.02.2025",
      type: "Verkauf",
      coin: "ETH",
      amount: 1.5,
      price: "$3,000",
    },
    {
      date: "31.01.2025",
      type: "Kauf",
      coin: "SOL",
      amount: 10,
      price: "$250",
    },
  ];

  const marketData = [
    { coin: "Bitcoin", price: "$30,000", change: "+2.5%" },
    { coin: "Ethereum", price: "$2,000", change: "-1.3%" },
    { coin: "Binance Coin", price: "$300", change: "+0.8%" },
  ];

  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; color: string }>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const pie = d3
      .pie<{ label: string; value: number; color: string }>()
      .value((d) => d.value);

    svg
      .selectAll("path")
      .data(pie(portfolioData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    svg
      .selectAll("text")
      .data(pie(portfolioData))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#ffffff")
      .text((d) => `${d.data.label}`);
  }, [portfolioData]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        {/* Benutzerinformationen */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profilübersicht</h1>
          <p className="text-gray-400">Name: John Doe</p>
          <p className="text-gray-400">Email: user@example.com</p>
        </div>

        {/* Portfoliozusammenfassung */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Portfoliozusammenfassung
          </h2>
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="text-lg font-bold">
              <p>
                Gesamtwert: <span className="text-green-400">$50,000</span>
              </p>
              <p>
                Tagesveränderung:{" "}
                <span className="text-green-400">+5% ($2,500)</span>
              </p>
            </div>
            <svg ref={chartRef} className="mt-6 md:mt-0"></svg>
          </div>
        </div>

        {/* Letzte Transaktionen */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Letzte Transaktionen</h2>
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-gray-400">
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Typ</th>
                <th className="px-4 py-2">Coin</th>
                <th className="px-4 py-2">Menge</th>
                <th className="px-4 py-2">Preis</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.type}</td>
                  <td className="px-4 py-2">{tx.coin}</td>
                  <td className="px-4 py-2">{tx.amount}</td>
                  <td className="px-4 py-2">{tx.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Marktübersicht */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Marktübersicht</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketData.map((data, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg text-center shadow"
              >
                <h3 className="text-lg font-bold">{data.coin}</h3>
                <p className="text-gray-400">{data.price}</p>
                <p
                  className={`font-semibold ${
                    data.change.includes("+")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {data.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sicherheitsstatus */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Sicherheitsstatus</h2>
          <p>
            2-Faktor-Authentifizierung:{" "}
            <span className="text-green-400">Aktiv</span>
          </p>
          <p>
            Letzte Anmeldung:{" "}
            <span className="text-gray-400">Berlin, 02.02.2025</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileOverview;
