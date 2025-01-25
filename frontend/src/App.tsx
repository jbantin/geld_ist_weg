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

const App = () => {
  return (
    <DefaultContextProvider>
      <Router>
        <div className="bg-zinc-900 text-white min-h-screen flex flex-col w-screen">
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
        </div>
      </Router>
    </DefaultContextProvider>
  );
};

export default App;
