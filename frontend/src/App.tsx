import { useState } from "react";
import Chart from "./components/Chart";
import News from "./components/News";
import Sidebar from "./components/Sidebar";
import Trading from "./components/Trading";
import "./App.css";

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex">
      <Sidebar onSelectCoin={setSelectedCoin} />
      <div className="flex flex-col items-center flex-grow">
        <Chart selectedCoin={selectedCoin} />
        {selectedCoin && <Trading selectedCoin={selectedCoin} />}
      </div>
      <News />
    </div>
  );
};

export default App;