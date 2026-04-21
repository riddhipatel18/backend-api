const express = require("express");
const router = express.Router();
const db = require("../db");


// ✅ GET: Fetch analytics logs (for dashboard)
router.get("/", (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    db.query(
        "SELECT * FROM analytics_logs ORDER BY id DESC LIMIT ?",
        [limit],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                count: rows.length,
                logs: rows
            });
        }
    );
});


// ✅ POST: Save analytics event (UPDATED LOGIC)
router.post("/", (req, res) => {
    const body = req.body || {};

    const event_name = body.event_name || body.event || "unknown";
    const user_id = body.user_id || body.user_db_id || null;
    const payload = JSON.stringify(body);

    let status = "raw";
    const lower = payload.toLowerCase();

    // 🔍 Detect anonymized data (HideDroid effect)
    if (
        lower.includes("hidden_") ||
        lower.includes("anonymized") ||
        lower.includes("*****") ||
        lower.includes("hidedroid")
    ) {
        status = "anonymized";
    }

    db.query(
        "INSERT INTO analytics_logs (user_id, event_name, payload, status) VALUES (?, ?, ?, ?)",
        [user_id, event_name, payload, status],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true,
                log_id: result.insertId,
                status: status
            });
        }
    );
});

module.exports = router;
