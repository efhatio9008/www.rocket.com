const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 用内存存消息（服务器重启后会清空）
let messages = [];

// 获取所有消息
app.get("/messages", (req, res) => {
  res.json(messages);
});

// 发送消息
app.post("/messages", (req, res) => {
  const { user, text, created_at } = req.body;

  if (!user || !text || !created_at) {
    return res.status(400).json({ error: "缺少必要字段" });
  }

  const newMessage = {
    id: Date.now(),
    user,
    text,
    created_at
  };

  messages.push(newMessage);
  res.json({ success: true, message: newMessage });
});

// 清空全部消息
app.delete("/messages", (req, res) => {
  messages = [];
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});