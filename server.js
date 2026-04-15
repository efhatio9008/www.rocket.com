const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "passwd",
  database: process.env.DB_NAME || "chat_system"
});

db.connect((err) => {
  if (err) {
    console.log("MySQL 连接失败:", err);
    return;
  }
  console.log("MySQL 已连接");
});

// 获取所有消息
app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages ORDER BY id ASC", (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// 发送消息
app.post("/messages", (req, res) => {
  const { user, text, created_at } = req.body;

  db.query(
    "INSERT INTO messages (user, text, created_at) VALUES (?, ?, ?)",
    [user, text, created_at],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// 清空全部消息
app.delete("/messages", (req, res) => {
  db.query("DELETE FROM messages", (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});