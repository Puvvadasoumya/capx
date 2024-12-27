const express = require('express');
const Stock = require('../models/Stock');
const router = express.Router();

// Fetch all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find();
    const totalValue = stocks.reduce((acc, stock) => acc + stock.quantity * stock.buyPrice, 0);
    res.json({ stocks, totalValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a stock
router.post('/', async (req, res) => {
  try {
    const { name, ticker, quantity, buyPrice } = req.body;
    const stock = new Stock({ name, ticker, quantity, buyPrice });
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a stock
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ticker, quantity, buyPrice } = req.body;
    await Stock.findByIdAndUpdate(id, { name, ticker, quantity, buyPrice });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a stock
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Stock.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
