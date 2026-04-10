const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://flow-mind-ai-eta.vercel.app", "https://flowmind-ai-pxll.onrender.com"]
}));
app.use(express.json());

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── Mongoose Model ───────────────────────────────────────────────────────────
const conversationSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);

// ─── POST /api/ask-ai ─────────────────────────────────────────────────────────
app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  console.log("KEY LOADED:", process.env.OPENROUTER_API_KEY ? "YES ✅" : "NO ❌");

  try {
    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Flow App",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
        }),
      }
    );

    const data = await openRouterRes.json();

    if (data.error) {
      console.log("OPENROUTER ERROR:", JSON.stringify(data.error, null, 2)); // 👈 add this
      const errorMessage = data.error.metadata?.raw || data.error.message || "Failed to get AI response";
      return res.status(500).json({ error: errorMessage });
    }

    const answer = data.choices[0].message.content;
    res.json({ response: answer });
  } catch (err) {
    console.error("OpenRouter error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});



// ─── POST /api/save ───────────────────────────────────────────────────────────
app.post("/api/save", async (req, res) => {
  const { prompt, response } = req.body;

  if (!prompt || !response) {
    return res.status(400).json({ error: "Prompt and response are required" });
  }

  try {
    const convo = new Conversation({ prompt, response });
    await convo.save();
    res.json({ message: "Saved successfully!", id: convo._id });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save to database" });
  }
});

// ─── GET /api/history ─────────────────────────────────────────────────────────
app.get("/api/history", async (req, res) => {
  try {
    const history = await Conversation.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
