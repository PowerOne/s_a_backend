const pool = require('../config/db'); // Import the database connection

// Add a stock to the portfolio
const addStockToPortfolio = async (userId, stockSymbol, quantity, purchasePrice) => {
    const result = await pool.query(
        'INSERT INTO portfolio (user_id, stock_symbol, quantity, purchase_price) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, stockSymbol, quantity, purchasePrice]
    );
    return result.rows[0];
};

// Get all stocks from the portfolio for a user
const getPortfolio = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM portfolio WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return result.rows;
};

// Update a stock in the portfolio
const updateStockInPortfolio = async (userId, stockId, stockSymbol, quantity, purchasePrice) => {
    const result = await pool.query(
        'UPDATE portfolio SET stock_symbol = $1, quantity = $2, purchase_price = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
        [stockSymbol, quantity, purchasePrice, stockId, userId]
    );
    return result.rows[0];
};

// Delete a stock from the portfolio
const deleteStockFromPortfolio = async (userId, stockId) => {
    const result = await pool.query(
        'DELETE FROM portfolio WHERE id = $1 AND user_id = $2 RETURNING *',
        [stockId, userId]
    );
    return result.rows[0];
};

module.exports = {
    addStockToPortfolio,
    getPortfolio,
    updateStockInPortfolio,
    deleteStockFromPortfolio
};
