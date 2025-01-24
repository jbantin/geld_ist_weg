// App.tsx

import rawData from "./assets/data/btcs.json"; // Your candlestick data imported here

interface CandleBtcData {
  openTime: number;

  highPrice: number;
  openPrice: number;
  lowPrice: number;
  closePrice: number;
}

// openTime: number,
//   openPrice: 96407.99,
//   "highPrice": 96411.99,
//   "lowPrice": 96376,
//   "closePrice": 96376,
//   "volume": 8.18452,
//   "closeTime": 1733011259999,
//   "quoteAssetVolume": 788996.1628126,
//   "numberOfTrades": 1763,
//   "takerBuyBaseVolume": 3.18577,
//   "takerBuyQuoteVolume": 307128.8909746,

const data = rawData as CandleBtcData[];

const App = () => {
  return (
    <div>
      <h1>huhu</h1>
    </div>
  );
};

export default App;
// ReactDOM.render(<App />, document.getElementById("root"));
