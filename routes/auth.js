const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, address, gender, age, phone } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name,email,password_hash,address,gender,age,phone) VALUES (?,?,?,?,?,?,?)",
    [name, email, hash, address, gender, age, phone],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({ success: true, user_id: result.insertId });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0)
      return res.status(401).json({ message: "Invalid user" });

    const user = result[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match)
      return res.status(401).json({ message: "Wrong password" });

    delete user.password_hash;

    res.json({ success: true, user });
  });
});

module.exports = router;