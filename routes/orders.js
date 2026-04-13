const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const userId = req.body.user_id ?? req.body.userId ?? null;
  const orderId = req.body.order_id ?? req.body.orderId ?? null;
  const total = req.body.total ?? 0;
  const items = req.body.items ?? [];

  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "order_id is required"
    });
  }

  const itemsJson = JSON.stringify(items);

  db.query(
    "INSERT INTO orders (user_id, order_id, total, items_json) VALUES (?, ?, ?, ?)",
    [userId, orderId, total, itemsJson],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        order_db_id: result.insertId,
        order_id: orderId
      });
    }
  );
});

module.exports = router;
