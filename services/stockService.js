const axios = require("axios");

const getStockData = async (stockSymbol, startDate, endDate) => {
    const response = await axios.get(`https://finance-api.example.com/data`, {
        params: { symbol: stockSymbol, start: startDate, end: endDate },
    });
    return response.data;
};

module.exports = { getStockData };
