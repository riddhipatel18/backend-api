const mongoose = require("mongoose");
const Counter = require("./Counter");

const OrderSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    user_id: { type: Number, default: null, index: true },
    order_id: { type: String, required: true, unique: true, index: true },
    total: { type: Number, default: 0 },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    items_json: { type: String, default: "[]" }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false
  }
);

OrderSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && (this.id === undefined || this.id === null)) {
      this.id = await Counter.getNext("orders");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Order", OrderSchema);
