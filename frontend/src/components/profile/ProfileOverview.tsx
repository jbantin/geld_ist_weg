import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";

interface ProfileOverviewProps {
  currentPrices: { [key: string]: number };
  currentChanges: { [key: string]: string }; // neu
}

const ProfileOverview = ({ currentPrices, currentChanges }: ProfileOverviewProps) => {
  const portfolioData = [
    { label: "Bitcoin (BTC)", ammount: 0.14, color: "#FF9900" },    // neu: Menge 1.2 BTC
    { label: "Ethereum (ETH)", ammount: 2, color: "#627EEA" },     // neu: Menge 3.4 ETH
    { label: "Binance Coin (BNB)", ammount: 10, color: "#F0B90B" },  // neu: Menge 15 BNB
    { label: "Solana (SOL)", ammount: 5,  color: "#9945FF" },        // neu: Menge 200 SOL
  ];

  // Neuer Gesamtwert basierend auf aktuellen Preisen:
  const totalPortfolioValue = portfolioData.reduce(
    (sum, coin) => sum + coin.ammount * (currentPrices[coin.label] || 0),
    0
  );

  const transactions = [
    {
      date: "02.02.2025",
      time: "12:01:07",
      type: "Kauf",
      coin: "BTC",
      amount: 0.1,
      price: "$9,541",
    },
    {
      date: "01.02.2025",
      time: "12:01:07",
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
    const updateChart = () => {
      if (!chartRef.current) return;

      // Erstelle ein Array mit berechnetem Gesamtwert pro Coin
      const chartData = portfolioData.map(coin => ({
        ...coin,
        totalValue: coin.ammount * (currentPrices[coin.label] || 0)
      }));

      // Dynamische Dimensionierung basierend auf Fenstergröße
      const width = window.innerWidth * 0.3;
      const height = window.innerHeight * 0.3;
      const radius = Math.min(width, height) / 2;

      d3.select(chartRef.current).selectAll("*").remove();

      const svg = d3
        .select(chartRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      const arc = d3
        .arc<d3.PieArcDatum<{ label: string; ammount: number; color: string; totalValue: number }>>()
        .innerRadius(radius * 0.5)
        .outerRadius(radius);

      const pie = d3
        .pie<{ label: string; ammount: number; color: string; totalValue: number }>()
        .value(d => d.totalValue);

      const arcs = pie(chartData);

      svg
        .selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => d.data.color)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2);

      svg
        .selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "#ffffff")
        .text(d => d.data.label);
    };

    updateChart();
    window.addEventListener("resize", updateChart);
    return () => window.removeEventListener("resize", updateChart);
  }, [portfolioData, currentPrices]);

  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto btn-bg p-8 rounded-lg shadow-lg"
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
                Gesamtwert:{" "}
                <span className="text-green-400">
                  ${totalPortfolioValue.toFixed(2)}
                </span>
              </p>
              <p>
                Tagesveränderung:{" "}
                <span className="text-green-400">+5% ($2,500)</span>
              </p>
            </div>
            <svg ref={chartRef} className="mt-6 md:mt-0"></svg>
          </div>
        </div>

        {/* Neue Sektion: Bestände pro Coin mit aktuellem Preis */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Meine Bestände</h2>
          <ul className="flex justify-between flex-wrap">
            {portfolioData.map((coin, index) => {
              const currentPrice = currentPrices[coin.label] || 0;
              return (
                <li key={index} className="mb-2">
                  <span className="font-bold">{coin.label}:</span> {coin.ammount} 
                  <span className="text-sm text-gray-400">
                    {" "}
                    (Preis: ${(parseFloat(currentPrice.toFixed(2)) * coin.ammount).toFixed(2)})
                  </span>
                </li>
              );
            })}
          </ul>
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
            {marketData.map((data, index) => {
              // Mapping von statischem Coin-Namen auf currentPrices/currentChanges-Schlüssel
              const coinMapping: { [key: string]: string } = {
                "Bitcoin": "Bitcoin (BTC)",
                "Ethereum": "Ethereum (ETH)",
                "Binance Coin": "Binance Coin (BNB)"
              };
              const coinKey = coinMapping[data.coin];
              const currentPrice = currentPrices[coinKey] || 0;
              // Verwende den dynamisch abgefragten Change-Wert, Fallback auf den statischen Wert
              const changeValue = currentChanges[coinKey] || data.change;
              return (
                <div key={index} className="bg-accent p-4 rounded-lg text-center shadow">
                  <h3 className="text-lg font-bold">{data.coin}</h3>
                  <p className="text-gray-400">Preis: ${currentPrice.toFixed(2)}</p>
                  <p className={`font-semibold ${changeValue.includes("+") ? "text-green-400" : "text-red-400"}`}>
                    {changeValue}
                  </p>
                </div>
              );
            })}
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
