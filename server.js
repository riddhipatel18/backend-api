const express = require("express");
const app = express();
const cors = require("cors");

// ✅ IMPORT DB
const db = require("./db");

app.use(cors());
app.use(express.json());

// ✅ AUTH ROUTES
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ GET PRODUCTS (VERY IMPORTANT)
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

// ✅ (OPTIONAL) ADD ANALYTICS
app.post("/analytics", (req, res) => {
  const { event_name, product_id } = req.body;

  const sql = "INSERT INTO analytics_events (event_name, product_id) VALUES (?, ?)";

  db.query(sql, [event_name, product_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
