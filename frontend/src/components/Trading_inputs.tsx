import { useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";

const Trading = () => {
  const { selectedCoin, coins = [] } = useContext(DefaultContext);
  const [amount, setAmount] = useState<string>("0");

  const coin = coins.find((coin) => coin.symbol === selectedCoin);
  const price = coin ? coin.price : 0;

  const handleBuy = () => {
    alert(`Gekauft: ${amount} von ${selectedCoin} zu ${price}`);
  };

  const handleSell = () => {
    alert(`Verkauft: ${amount} von ${selectedCoin} zu ${price}`);
  };

  return (
    <div className="trading flex items-center justify-center  bg-dark text-text  w-full rounded m-2">
      
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 text-text w-full outline max-w-[200px] rounded"
        />
      
            <p className="ml-2">Preis: {price.toFixed(2)}$</p>
      
        <div className="ml-2">
          <button
            className="bg-green-500 hover:bg-green-700 text-light font-bold py-2 px-4 rounded mr-2"
            onClick={handleBuy}
          >
            Kaufen
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-light font-bold py-2 px-4 rounded"
            onClick={handleSell}
          >
            Verkaufen
          </button>
          <span> Gesamt: {(price * parseFloat(amount)).toFixed(2)} $</span>
        </div>
      </div>
 
  );
};

export default Trading;
