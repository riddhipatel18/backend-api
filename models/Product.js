const mongoose = require("mongoose");
const Counter = require("./Counter");

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    category: { type: String, default: "" },
    image: { type: String, default: "" },
    rate: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false
  }
);

ProductSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && (this.id === undefined || this.id === null)) {
      this.id = await Counter.getNext("products");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Product", ProductSchema);
