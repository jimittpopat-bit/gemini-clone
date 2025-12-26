// controllers/userController.js
const pool = require("../db");

const updateTheme = async (req, res) => {
  
  console.log("Theme route hit", req.user.id, req.body);

  const userId = req.user.id;
  const { theme } = req.body;

  if (!["dark", "light"].includes(theme)) {
    return res.status(400).json({ message: "Invalid theme" });
  }

  await pool.query(
    "UPDATE users SET theme = $1 WHERE id = $2",
    [theme, userId]
  );

  res.json({ theme });
};
module.exports = { updateTheme };