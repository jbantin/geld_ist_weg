import Chart from "../components/Chart";
import Sidebar from "../components/Sidebar";

const ChartPage = () => {
  return (
    <div className="flex flex-col lg:flex-row flex-grow bg-light max-w-screen">
      {window.innerWidth >= 1200 && <Sidebar />}
      <Chart />
    </div>
  );
};

export default ChartPage;
