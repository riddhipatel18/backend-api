const mongoose = require("mongoose");
const Counter = require("./Counter");

const AnalyticsLogSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, index: true },
    user_id: { type: Number, default: null, index: true },
    event_name: { type: String, default: "unknown", index: true },
    payload: { type: String, default: "{}" },
    payload_json: { type: mongoose.Schema.Types.Mixed, default: {} },
    headers: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip_address: { type: String, default: "" },
    user_agent: { type: String, default: "" },
    content_type: { type: String, default: "" },
    status: { type: String, enum: ["raw", "anonymized"], default: "raw", index: true },
    created_at: { type: Date, default: Date.now, index: true }
  },
  { versionKey: false }
);

AnalyticsLogSchema.pre("validate", async function (next) {
  try {
    if (this.isNew && (this.id === undefined || this.id === null)) {
      this.id = await Counter.getNext("analytics_logs");
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("AnalyticsLog", AnalyticsLogSchema);
