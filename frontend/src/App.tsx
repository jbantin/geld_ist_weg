import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useState } from "react";
import Chart from "./components/Chart";
import News from "./components/News";
import Sidebar from "./components/Sidebar";
import Trading from "./components/Trading";
import Nav from "./components/Nav";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Button from "./components/Button";
import "./App.css";

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");
  const [showNews, setShowNews] = useState(true);

  return (
    <Router>
      <div className="bg-zinc-900 text-white min-h-screen flex flex-col">
        <Nav />
        <Routes>
          <Route path="/market" element={
            <div className="flex flex-grow relative">
              <Sidebar onSelectCoin={setSelectedCoin} />
              <div className="flex flex-col items-center flex-grow">
                <div className="flex flex-row items-start w-full">
                  <Chart selectedCoin={selectedCoin} />
                </div>
                {selectedCoin && <Trading selectedCoin={selectedCoin} />}
              </div>
              {showNews && <News onToggleNews={() => setShowNews(!showNews)} showToggleButton />}
              {!showNews && (
                <Button onClick={() => setShowNews(true)} className="absolute top-20 right-4">
                  Show News
                </Button>
              )}
            </div>
          } />
          <Route path="/news" element={<News />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;