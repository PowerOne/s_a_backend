const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const portfolioRoutes = require('./routes/portfolio'); // Import portfolio routes

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
