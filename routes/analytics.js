const express = require("express");
const AnalyticsLog = require("../models/AnalyticsLog");

const router = express.Router();

function detectStatus(payloadText) {
  const lower = String(payloadText || "").toLowerCase();

  if (
    lower.includes("hidden_") ||
    lower.includes("anonymized") ||
    lower.includes("*****") ||
    lower.includes("hidedroid")
  ) {
    return "anonymized";
  }

  return "raw";
}

// GET analytics logs
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);

    const logs = await AnalyticsLog.find()
      .sort({ id: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST analytics event
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    const event_name =
      body.event_name ||
      body.event ||
      body.eventName ||
      "unknown";

    const userIdRaw =
      body.user_id ??
      body.user_db_id ??
      body.customer_user_id ??
      null;

    const user_id =
      userIdRaw === null || userIdRaw === "" || Number.isNaN(Number(userIdRaw))
        ? null
        : Number(userIdRaw);

    const payloadText = JSON.stringify(body);
    const status = detectStatus(payloadText);

    const log = await AnalyticsLog.create({
      user_id,
      event_name,
      payload: payloadText,
      payload_json: body,
      headers: req.headers,
      ip_address: req.ip || req.headers["x-forwarded-for"] || "",
      user_agent: req.get("user-agent") || "",
      content_type: req.get("content-type") || "",
      status
    });

    res.json({
      success: true,
      log_id: log.id,
      status: log.status
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
