const express = require("express");
const router = express.Router();
const authMiddleware = require("../authMiddleware");
const pool = require("../db");



// Create a new chat
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING *",
      [userId, "New Chat"]
    );

    res.status(201).json({
      success: true,
      chat: result.rows[0],
    });
  } catch (error) {
    console.error("Create chat error:", error);
    res.status(500).json({
      success: false,
      message: "Could not create chat",
    });
  }
});

// Get all chats for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM chats WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.status(200).json({
      success: true,
      chats: result.rows,
    });
  } catch (error) {
    console.error("Fetch chats error:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch chats",
    });
  }
});

// Add message to a chat
router.post("/:chatId/messages", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;
  const { sender, content } = req.body || {};

  // basic validation
  if (!sender || !content) {
    return res.status(400).json({
      success: false,
      message: "Sender and content are required",
    });
  }

  try {
    // 1️⃣ Ensure chat belongs to user
    const chatCheck = await pool.query(
      "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
      [chatId, userId]
    );

    if (chatCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You do not own this chat",
      });
    }

    // 2️⃣ Insert message
    const result = await pool.query(
      "INSERT INTO messages (chat_id, sender, content) VALUES ($1, $2, $3) RETURNING *",
      [chatId, sender, content]
    );

    res.status(201).json({
      success: true,
      message: result.rows[0],
    });
  } catch (error) {
    console.error("Add message error:", error);
    res.status(500).json({
      success: false,
      message: "Could not add message",
    });
  }

  // 🔹 Update chat title ONLY once (first user message)
  if (sender === "user") {
    const chat = await pool.query(
      "SELECT title FROM chats WHERE id = $1 AND user_id = $2",
      [chatId, userId]
    );

    if (chat.rows.length && chat.rows[0].title === "New Chat") {
      await pool.query(
        "UPDATE chats SET title = $1 WHERE id = $2 AND user_id = $3",
        [content.slice(0, 50), chatId, userId]
      );
    }
  }
});

// Get messages for a chat
router.get("/:chatId/messages", authMiddleware, async (req, res) => {
  console.log("CHAT ID:", req.params.chatId);
  console.log("USER ID:", req.user?.id);
  const userId = req.user.id;
  const { chatId } = req.params;

  try {
    // Ensure chat belongs to user
    const chatCheck = await pool.query(
      "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
      [chatId, userId]
    );

    if (chatCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this chat",
      });
    }

    const messages = await pool.query(
      "SELECT id, sender, content, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at ASC",
      [chatId]
    );

    res.status(200).json({
      success: true,
      messages: messages.rows,
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch messages",
    });
  }
});

// DELETE a chat (protected)
router.delete("/:chatId", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;

  try {
    // 1️⃣ Check ownership
    const chatCheck = await pool.query(
      "SELECT id FROM chats WHERE id = $1 AND user_id = $2",
      [chatId, userId]
    );

    if (chatCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You do not own this chat",
      });
    }

    // 2️⃣ Delete messages first
    await pool.query("DELETE FROM messages WHERE chat_id = $1", [chatId]);

    // 3️⃣ Delete chat
    await pool.query("DELETE FROM chats WHERE id = $1", [chatId]);

    res.json({
      success: true,
      message: "Chat deleted",
    });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
    });
  }
});

module.exports = router;
