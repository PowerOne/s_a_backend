const express = require('express');
const authenticate = require('../middleware/authMiddleware'); // To ensure authenticated access
const {
    addStockToPortfolio,
    getPortfolio,
    updateStockInPortfolio,
    deleteStockFromPortfolio
} = require('../services/portfolioService');

const router = express.Router();

// Get portfolio data
router.get('/', authenticate, async (req, res) => {
    const userId = req.user.userId; // Extracted from JWT in auth middleware
    try {
        const portfolio = await getPortfolio(userId);
        res.status(200).json({ portfolio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch portfolio' });
    }
});

// Add a stock to the portfolio
router.post('/add', authenticate, async (req, res) => {
    const userId = req.user.userId;
    const { stockSymbol, quantity, purchasePrice } = req.body;
    try {
        const stock = await addStockToPortfolio(userId, stockSymbol, quantity, purchasePrice);
        res.status(201).json({ stock, message: 'Stock added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to add stock' });
    }
});

// Update a stock in the portfolio
router.put('/update/:id', authenticate, async (req, res) => {
    const userId = req.user.userId;
    const stockId = req.params.id;
    const { stockSymbol, quantity, purchasePrice } = req.body;

    try {
        const updatedStock = await updateStockInPortfolio(userId, stockId, stockSymbol, quantity, purchasePrice);
        if (!updatedStock) {
            return res.status(404).json({ error: 'Stock not found or unauthorized' });
        }
        res.status(200).json({ updatedStock, message: 'Stock updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to update stock' });
    }
});

// Delete a stock from the portfolio
router.delete('/delete/:id', authenticate, async (req, res) => {
    const userId = req.user.userId;
    const stockId = req.params.id;

    try {
        const deletedStock = await deleteStockFromPortfolio(userId, stockId);
        if (!deletedStock) {
            return res.status(404).json({ error: 'Stock not found or unauthorized' });
        }
        res.status(200).json({ deletedStock, message: 'Stock deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to delete stock' });
    }
});

module.exports = router;
