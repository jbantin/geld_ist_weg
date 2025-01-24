import { useState } from "react";
import Chart from "./components/Chart";
import News from "./components/News";
import Sidebar from "./components/Sidebar";
import Trading from "./components/Trading";
import "./App.css";

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex">
      <Sidebar onSelectCoin={(id: string) => setSelectedCoin(id)} />
      <div className="flex flex-col items-center flex-grow">
        <h1 className="text-3xl font-bold my-4">huhu</h1>
        <Chart />
        {selectedCoin && <Trading selectedCoin={selectedCoin} />}
      </div>
      <News />
    </div>
  );
};

export default App;