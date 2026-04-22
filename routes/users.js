const express = require("express");
const User = require("../models/User");
const Order = require("../models/Order");

const router = express.Router();

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address || "",
    gender: user.gender || "",
    age: user.age || 0,
    phone: user.phone || "",
    created_at: user.created_at
  };
}

// GET USER + ORDERS
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await User.findOne({ id }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const orders = await Order.find({ user_id: id })
      .sort({ id: -1 })
      .lean();

    res.json({
      success: true,
      user: sanitizeUser(user),
      orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// UPDATE USER
router.post("/update", async (req, res) => {
  try {
    const { user_id, name, address = "", gender = "", age = 0, phone = "" } = req.body || {};

    if (!user_id || !name) {
      return res.status(400).json({
        success: false,
        message: "user_id and name are required"
      });
    }

    const updated = await User.findOneAndUpdate(
      { id: Number(user_id) },
      {
        $set: {
          name,
          address,
          gender,
          age: Number(age) || 0,
          phone
        }
      },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found after update"
      });
    }

    res.json({
      success: true,
      user: sanitizeUser(updated)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
