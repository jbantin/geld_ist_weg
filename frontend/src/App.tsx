import { BrowserRouter as Router, Routes, Route } from "react-router";
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

const App = () => {
  return (
    <DefaultContextProvider>
      <Router>
        <motion.div
          className="flex flex-col h-screen bg-zinc-900 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .5 }}>
          <Nav />
          <Routes>
            <Route
              path="/market"
              element={
                <div className="flex flex-grow ">
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
