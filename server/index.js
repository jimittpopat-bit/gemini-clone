require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("./db");
const authMiddleware = require("./authMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const { updateTheme } = require("./controllers/userController");
const app = express();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

/* ------------------ MIDDLEWARE ------------------ */
app.use(express.json());

const cors = require("cors");

app.use(cors({
  origin: [
    "https://gemini-clone-rho-six.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));



/* ------------------ ROUTES ------------------ */

// health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

/* -------- AUTH -------- */

// register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [name, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
});

// login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        theme: user.theme,
      },
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

/* -------- USER -------- */

app.put("/api/user/theme", authMiddleware, updateTheme);

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

/* -------- CHATS (ALL PROTECTED) -------- */
app.use("/api/chats", chatRoutes);

/* ------------------ START SERVER ------------------ */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
