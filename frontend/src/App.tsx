import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { DefaultContextProvider } from "./context/DefaultContext";
import Chart from "./components/Chart";
import News from "./components/News";
import Sidebar from "./components/Sidebar";
import Nav from "./components/Nav";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import "./App.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const App = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(systemTheme);
    document.documentElement.setAttribute("data-theme", systemTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <DefaultContextProvider>
      <Router>
        <motion.div
          className="flex flex-col h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Nav theme={theme} setTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Navigate to="/market" replace />} />
            <Route
              path="/market"
              element={
                <div className="flex flex-grow">
                  <Sidebar />
                  <Chart />
                  <News />
                </div>
              }
            />
            <Route path="/news" element={<News />} />
            <Route path="/user" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </motion.div>
      </Router>
    </DefaultContextProvider>
  );
};

export default App;
