const express = require("express");
const router = express.Router();
const db = require("../db");

// GET USER + ORDERS
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT id, name, email, address, gender, age, phone, created_at FROM users WHERE id=?",
    [id],
    (err, userRes) => {
      if (err) return res.status(500).json(err);
      if (userRes.length === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      db.query(
        "SELECT * FROM orders WHERE user_id=? ORDER BY id DESC",
        [id],
        (err, orderRes) => {
          if (err) return res.status(500).json(err);

          res.json({
            success: true,
            user: userRes[0],
            orders: orderRes
          });
        }
      );
    }
  );
});

// UPDATE USER
router.post("/update", (req, res) => {
  const { user_id, name, address, gender, age, phone } = req.body;

  if (!user_id || !name) {
    return res.status(400).json({
      success: false,
      message: "user_id and name are required"
    });
  }

  db.query(
    "UPDATE users SET name=?, address=?, gender=?, age=?, phone=? WHERE id=?",
    [name, address || "", gender || "", age || 0, phone || "", user_id],
    (err) => {
      if (err) return res.status(500).json(err);

      db.query(
        "SELECT id, name, email, address, gender, age, phone, created_at FROM users WHERE id=?",
        [user_id],
        (err2, rows) => {
          if (err2) return res.status(500).json(err2);
          if (!rows.length) {
            return res.status(404).json({ success: false, message: "User not found after update" });
          }

          res.json({
            success: true,
            user: rows[0]
          });
        }
      );
    }
  );
});

module.exports = router;
