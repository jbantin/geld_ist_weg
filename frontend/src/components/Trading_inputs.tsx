import { useState, useContext } from "react";
import { DefaultContext } from "../context/DefaultContext";

const Trading = () => {
  const { selectedCoin, coins = [] } = useContext(DefaultContext);
  const [amount, setAmount] = useState<string>("0");

  const coin = coins.find((coin) => coin.symbol === selectedCoin);
  const price = coin ? coin.price : 0;

  const handleBuy = () => {
    alert(`Bought: ${amount} of ${selectedCoin} at ${price}`);
  };

  const handleSell = () => {
    alert(`Sold: ${amount} of ${selectedCoin} at ${price}`);
  };

  return (
    <div className="trading flex items-center justify-center bg-dark text-swich  w-full rounded mt-[-80px]">
      
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 text-swich w-full btn-bg max-w-[200px] rounded"
        />
      
            <p className="btn-bg p-2 m-2 rounded">Price: {price.toFixed(2)}$</p>
      
        <div className="ml-2">
          <button
            className="bg-accent hover:bg-green-700 text-swich font-bold py-2 px-4 rounded mr-2 cursor-pointer"
            onClick={handleBuy}
          >
            Buy
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-swich font-bold py-2 px-4 rounded cursor-pointer"
            onClick={handleSell}
          >
            Sell
          </button>
          <span className="btn-bg p-2 m-2 rounded"> Total: {price ? (price * parseFloat(amount)).toFixed(2) : "0"} $</span>
        </div>
      </div>
 
  );
};

export default Trading;
