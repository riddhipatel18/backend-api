const express = require("express");
const cors = require("cors");

const app = express();

// Initialize DB connection/pool
require("./db");

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");
const analyticsRoutes = require("./routes/analytics");

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Mount routes
app.use("/api", authRoutes);              // /api/register , /api/login
app.use("/api/products", productRoutes); // GET /api/products
app.use("/api/orders", orderRoutes);     // POST /api/orders
app.use("/api/users", userRoutes);       // GET /api/users/:id , POST /api/users/update
app.use("/api/analytics", analyticsRoutes); // POST /api/analytics , GET /api/analytics

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
