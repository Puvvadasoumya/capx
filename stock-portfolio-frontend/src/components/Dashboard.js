// components/Dashboard.js

import React, { useEffect, useState } from "react";
import { fetchStockPrices } from "../services/stockAPI"; // Import the fetchStockPrices function

const Dashboard = () => {
  const [tickers, setTickers] = useState(["AAPL", "GOOGL", "MSFT"]); // Example tickers
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch real-time stock prices on mount and update periodically
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const prices = await fetchStockPrices(tickers);
      setStockPrices(prices);
      setLoading(false);
    };

    fetchData();

    // Set interval for automatic price updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

    // Clear interval when component unmounts
    return () => clearInterval(interval);
  }, [tickers]);

  return (
    <div>
      <h1>Real-Time Stock Prices</h1>

      {loading ? (
        <p>Loading stock prices...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((ticker) => (
              <tr key={ticker}>
                <td>{ticker}</td>
                <td>
                  {stockPrices[ticker] === "N/A"
                    ? "N/A"
                    : stockPrices[ticker] === "Error"
                    ? "Error"
                    : `$${stockPrices[ticker]}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
