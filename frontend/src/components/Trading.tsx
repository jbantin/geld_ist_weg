import { useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";

const Trading = () => {
  const { selectedCoin, coins = [] } = useContext(DefaultContext);
  const [amount, setAmount] = useState(0);

  const coin = coins.find((coin) => coin.symbol === selectedCoin);
  const price = coin ? parseFloat(coin.price) : 0;

  const handleBuy = () => {
    alert(`Gekauft: ${amount} von ${selectedCoin} zu ${price}`);
  };

  const handleSell = () => {
    alert(`Verkauft: ${amount} von ${selectedCoin} zu ${price}`);
  };

  return (
    <div className="trading bg-zinc-800 text-white p-4 m-auto">
      <h2 className="text-2xl font-bold mb-4">Trading</h2>
      <div className="mb-4">
        <label className="block mb-2">Menge:</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="p-2 text-zinc-200 w-full outline"
        />
      </div>
      <div className="mb-4">
        <p>Aktueller Preis: ${price.toFixed(2)}</p>
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
