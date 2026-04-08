const express = require("express");
const router = express.Router();
const db = require("../db");

// GET USER + ORDERS
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query("SELECT * FROM users WHERE id=?", [id], (err, userRes) => {
    if (err) return res.status(500).json(err);
    if (userRes.length === 0) return res.status(404).json({ message: "Not found" });

    db.query(
      "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
      [id],
      (err, orderRes) => {
        if (err) return res.status(500).json(err);

        res.json({
          user: userRes[0],
          orders: orderRes
        });
      }
    );
  });
});

// UPDATE USER
router.post("/update", (req, res) => {
  const { user_id, name, address, gender, age, phone } = req.body;

  db.query(
    "UPDATE users SET name=?, address=?, gender=?, age=?, phone=? WHERE id=?",
    [name, address, gender, age, phone, user_id],
    err => {
      if (err) return res.status(500).json(err);

      res.json({ success: true });
    }
  );
});

module.exports = router;