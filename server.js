const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json({ limit: "2mb" }));

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

// Ping endpoint for UptimeRobot
app.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    status: "awake",
    timestamp: new Date()
  });
});

// Mount routes
app.use("/api", authRoutes);                 // /api/register , /api/login
app.use("/api/products", productRoutes);    // GET /api/products
app.use("/api/orders", orderRoutes);        // POST /api/orders
app.use("/api/users", userRoutes);          // GET /api/users/:id
app.use("/api/analytics", analyticsRoutes); // POST /api/analytics

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
