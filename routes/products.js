const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    const rows = await Product.find()
      .sort({ id: 1 })
      .limit(limit)
      .lean();

    const products = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      price: Number(row.price || 0),
      category: row.category,
      image: row.image,
      rating: {
        rate: Number(row.rate || 0),
        count: Number(row.count || 0)
      },
      inStock: row.inStock !== false
    }));

    res.json(products);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
