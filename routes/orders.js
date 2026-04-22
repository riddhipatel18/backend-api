const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userIdRaw = req.body?.user_id ?? req.body?.userId ?? null;
    const orderId = req.body?.order_id ?? req.body?.orderId ?? null;
    const total = Number(req.body?.total ?? 0);
    const items = Array.isArray(req.body?.items) ? req.body.items : [];

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "order_id is required"
      });
    }

    const exists = await Order.findOne({ order_id: String(orderId) }).lean();
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "order_id already exists"
      });
    }

    const order = await Order.create({
      user_id:
        userIdRaw === null || userIdRaw === "" || Number.isNaN(Number(userIdRaw))
          ? null
          : Number(userIdRaw),
      order_id: String(orderId),
      total,
      items,
      items_json: JSON.stringify(items)
    });

    res.json({
      success: true,
      order_db_id: order.id,
      order_id: order.order_id
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
