import { useState } from "react";

interface TradingProps {
  selectedCoin: string;
}

const Trading: React.FC<TradingProps> = ({ selectedCoin }) => {
  const [amount, setAmount] = useState(0);

  const handleBuy = () => {
    // Kauf-Logik hier hinzufügen
    alert(`Gekauft: ${amount} von ${selectedCoin}`);
  };

  const handleSell = () => {
    // Verkaufs-Logik hier hinzufügen
    alert(`Verkauft: ${amount} von ${selectedCoin}`);
  };

  return (
    <div className="trading bg-zinc-800 text-white p-4 m-auto">
      <h2 className="text-2xl font-bold mb-4">Trading</h2>
      <div className="mb-4">
        <label className="block mb-2">Menge:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="p-2 text-black"
        />
      </div>
      <div>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleBuy}
        >
          Kaufen
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSell}
        >
          Verkaufen
        </button>
      </div>
    </div>
  );
};

export default Trading;
