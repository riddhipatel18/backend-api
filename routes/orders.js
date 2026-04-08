const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, order_id, total, items } = req.body;

  const itemsJson = JSON.stringify(items);

  db.query(
    "INSERT INTO orders (user_id, order_id, total, items_json) VALUES (?,?,?,?)",
    [user_id, order_id, total, itemsJson],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

module.exports = router;