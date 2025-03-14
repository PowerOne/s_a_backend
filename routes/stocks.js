const express = require("express");
const { getStockData } = require("../services/stockService");
const router = express.Router();

router.get("/fetch", async (req, res) => {
    const { stockSymbol, startDate, endDate } = req.query;
    try {
        const data = await getStockData(stockSymbol, startDate, endDate);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
