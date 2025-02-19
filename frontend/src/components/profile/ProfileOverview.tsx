import { useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { DefaultContext } from "../../context/DefaultContext";
import { useNavigate } from "react-router-dom";

interface ProfileOverviewProps {
  currentPrices: { [key: string]: number };
  currentChanges: { [key: string]: string }; // neu
}

const ProfileOverview = ({ currentPrices, currentChanges }: ProfileOverviewProps) => {
  const { setIsLoggedIn } = useContext(DefaultContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:9001/user/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        alert("Logout fehlgeschlagen");
      }
    } catch (error) {
      console.error("Logout-Fehler:", error);
      alert("Ein Fehler ist aufgetreten");
    }
  };

  const portfolioData = [
    { label: "Bitcoin (BTC)", ammount: 0.14, color: "#FF9900" },    // neu: Menge 1.2 BTC
    { label: "Ethereum (ETH)", ammount: 2.241, color: "#627EEA" },     // neu: Menge 3.4 ETH
    { label: "Binance Coin (BNB)", ammount: 17.141, color: "#F0B90B" },  // neu: Menge 15 BNB
    { label: "Solana (SOL)", ammount: 51.1,  color: "#9945FF" },        // neu: Menge 200 SOL
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
        .attr("stroke", "#5c5c5c")
        .attr("stroke-width", 1);

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
    
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto btn-bg p-4 rounded-lg "
      >
        {/* Benutzerinformationen */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl text-swich font-bold">Profilübersicht</h1>
            <p className="text-swich">Name: John Doe</p>
            <p className="text-swich">Email: user@example.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0"
          >
            Logout
          </button>
        </div>

        {/* Portfoliozusammenfassung */}
        <div className="mb-8">
          <h2 className="text-xl text-swich font-semibold mb-4">
            Portfoliozusammenfassung
          </h2>
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="text-lg font-bold text-center md:text-left">
              <p>
                <span className="text-swich">Gesamtwert:  </span>
                <span className="text-accent">{" "+totalPortfolioValue.toFixed(2)} $</span> 
              </p>
              <p className="text-swich">
                Tagesveränderung:{" "}
                <span className="text-accent">+5% ($2,500)</span>
              </p>
            </div>
            <svg ref={chartRef} className="mt-6 md:mt-0"></svg>
          </div>
        </div>

        {/* Neue Sektion: Bestände pro Coin mit aktuellem Preis */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-swich">Meine Bestände</h2>
          <ul className="flex flex-col md:flex-row justify-between flex-wrap text-sm">
            {portfolioData.map((coin, index) => {
              const currentPrice = currentPrices[coin.label] || 0;
              return (
                <li key={index} className="mb-2">
                  <span className="font-bold text-swich">{coin.label}: {coin.ammount} </span>
                  <span className="text-sm text-swich">
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
          <h2 className="text-xl text-swich font-semibold mb-4">Letzte Transaktionen</h2>
          <table className="w-full text-left table-auto text-swich text-sm">
            <thead>
              <tr className="text-swich">
                <th className="px-2 py-1">Datum</th>
                <th className="px-2 py-1">Typ</th>
                <th className="px-2 py-1">Coin</th>
                <th className="px-2 py-1">Menge</th>
                <th className="px-2 py-1">Preis</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-2 py-1">{tx.date}</td>
                  <td className="px-2 py-1">{tx.type}</td>
                  <td className="px-2 py-1">{tx.coin}</td>
                  <td className="px-2 py-1">{tx.amount}</td>
                  <td className="px-2 py-1">{tx.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Marktübersicht */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-swich">Marktübersicht</h2>
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
                <div key={index} className="bg-accent p-4 rounded-lg text-center shadow text-swich text-sm">
                  <h3 className="text-lg font-bold">{data.coin}</h3>
                  <p className="text-swich">Preis: ${currentPrice.toFixed(2)}</p>
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
          <h2 className="text-xl font-semibold mb-4 text-swich">Sicherheitsstatus</h2>
          <p className="text-swich">
            2-Faktor-Authentifizierung:{" "}
            <span className="text-green-400">Aktiv</span>
          </p>
          <p className="text-swich">
            Letzte Anmeldung:{" "}
            <span className="text-swich">Berlin, 02.02.2025</span>
          </p>
        </div>
      </motion.div>
   
  );
};

export default ProfileOverview;
