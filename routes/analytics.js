const express = require("express");
const router = express.Router();
const db = require("../db");

// VIEW RECENT ANALYTICS LOGS
router.get("/", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

  db.query(
    "SELECT * FROM analytics_logs ORDER BY id DESC LIMIT ?",
    [limit],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, count: rows.length, logs: rows });
    }
  );
});

// SAVE ANALYTICS EVENT
router.post("/", (req, res) => {
  const { event_name, user_id } = req.body;
  const payload = JSON.stringify(req.body);

  let status = "raw";
  if (payload.includes("***") || payload.includes("hidden_")) {
    status = "anonymized";
  }

  db.query(
    "INSERT INTO analytics_logs (user_id, event_name, payload, status) VALUES (?, ?, ?, ?)",
    [user_id || null, event_name || "unknown", payload, status],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        success: true,
        log_id: result.insertId,
        status
      });
    }
  );
});

module.exports = router;
