const mongoose = require("mongoose");
const Counter = require("./Counter");

const UserSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    address: { type: String, default: "" },
    gender: { type: String, default: "" },
    age: { type: Number, default: 0 },
    phone: { type: String, default: "" }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false
  }
);

UserSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && (this.id === undefined || this.id === null)) {
      this.id = await Counter.getNext("users");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
