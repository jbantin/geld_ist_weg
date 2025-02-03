import { BrowserRouter as Router, Routes, Route } from "react-router";
import { DefaultContextProvider } from "./context/DefaultContext";
import Trading from "./pages/Trading";
import News from "./pages/News";
import Nav from "./components/ui/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Market from "./pages/Market";
import "./App.css";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
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
          className="flex flex-col md:h-screen bg-light w-full max-w-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Nav theme={theme} setTheme={setTheme} />
          <Routes>
            <Route path="/" element={<Market />} />
            <Route path="/trade" element={<Trading />} />
            <Route path="/verify_email/:token" element={<VerifyEmail />} />
            <Route path="/news" element={<News />} />
            <Route path="/user" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/market" element={<Market />} />
          </Routes>
        </motion.div>
      </Router>
    </DefaultContextProvider>
  );
};

export default App;
