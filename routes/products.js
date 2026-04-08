const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  db.query("SELECT * FROM products LIMIT ?", [limit], (err, result) => {
    if (err) return res.status(500).json(err);

    const products = result.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: parseFloat(row.price),
      category: row.category,
      image: row.image,
      rating: {
        rate: parseFloat(row.rate),
        count: row.count
      }
    }));

    res.json(products);
  });
});

module.exports = router;