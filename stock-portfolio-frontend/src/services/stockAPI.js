// services/stockAPI.js

const fetchStockPrices = async (tickers) => {
    const apiKey = "ctiomr1r01qgfbsv45agctiomr1r01qgfbsv45b0"; // Use the environment variable for the API key
    const baseUrl = "https://finnhub.io/api/v1/quote"

    const prices = {};
  
    for (const ticker of tickers) {
      try {
        // Fetch the stock price from Finnhub API
        const response = await fetch(`${baseUrl}?symbol=${ticker}&token=${apiKey}`);
  
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${ticker}`);
        }
  
        // Parse the response data
        const data = await response.json();
  
        // Check if we received the expected price data
        if (data && data.c) {
          prices[ticker] = data.c; // Assign the current price (c)
        } else {
          prices[ticker] = 'N/A'; // If no price is available, set 'N/A'
        }
      } catch (error) {
        console.error(`Error fetching data for ${ticker}:`, error);
        prices[ticker] = 'Error'; // Handle error by displaying 'Error' instead of price
      }
    }
  
    return prices;
  };
  
  export { fetchStockPrices };
  