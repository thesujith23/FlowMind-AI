# AiChat Project - Master Interview Guide (Code & Concepts)

This is your ultimate cheat sheet for the AiChat interview. It covers **every single technical keyword**, followed by the **exact codebase line-by-line**.

---

## 🏗️ PART 1: The "What is..." Glossary (Key Concepts)

If the interviewer asks "What is X?", read out these specific definitions:

### Q: What is React Flow (`@xyflow/react`)?
**Answer:** React Flow is a highly customizable library for building node-based applications (like flowcharts). In our app, instead of a boring traditional chat UI, we used it to draw visual "boxes" (Nodes) for the prompt and AI response, and connect them with animated lines (Edges) to visualize the flow of data.

### Q: What is Node.js and Express?
**Answer:** Node.js lets us run JavaScript on the server. Express is a framework for Node.js that makes it incredibly easy to set up a web server and create "endpoints" (like `/api/ask-ai`) that listen for requests from the frontend.

### Q: What is MongoDB and Mongoose?
**Answer:** MongoDB is a NoSQL database that stores data in flexible JSON-like documents. Mongoose is an ODM (Object Data Modeler); it lets us write a strict "Schema" (a blueprint) to enforce rules—like ensuring the `prompt` is always saved as a String.

### Q: What is CORS (Cross-Origin Resource Sharing)?
**Answer:** For security, browsers usually block a frontend running on one URL (like `localhost:5173`) from talking to a backend on another URL (`localhost:5000`). We setup `cors` in our backend to explicitly approve and allow the frontend to talk to it.

### Q: What is a REST API & `fetch`?
**Answer:** A REST API is a standard way applications talk to each other over the web. We use the `fetch()` function to send HTTP requests (`GET` to get history, `POST` to save data/ask the AI) between the React frontend, the Node backend, and the OpenRouter AI.

### Q: What are React Hooks (`useState` & `useCallback`)?
**Answer:** Hooks are special functions in React. 
- `useState`: Holds data in memory (like the text the user typed). When that data changes, React instantly updates the screen.
- `useCallback`: Cash-saves (memoizes) a function so React doesn't waste CPU power rebuilding that exact same function every time the screen renders.

### Q: What is `async` and `await`?
**Answer:** They handle asynchronous operations that take time (like waiting for the AI to reply over the internet). `await` pauses the code execution safely on that specific line until the internet request finishes, preventing the app from freezing.

---

## 💻 PART 2: The Backend Code Explained Line-by-Line

### 1. Database Schema (`backend/models/Conversation.js`)
```javascript
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: "google/gemma-3-4b-it:free",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
```
**Line-by-Line Explanation:**
- `const mongoose = require("mongoose");` : Imports the database library.
- `const conversationSchema = new mongoose.Schema({ ... })` : Creates the blueprint for our data.
- `prompt: { ... trim: true }` : Defines the prompt. `trim: true` cuts off accidental spaces at the beginning or end of the user's sentence.
- `model: { ... default: ... }` : Records which AI answered. We default to Google's Gemma-3.
- `timestamps: true` : Automatically tells the database to attach the exact date/time this was created.
- `module.exports = mongoose.model(...)` : Packages this blueprint up so we can use it inside `server.js`.

### 2. Main Server Logic (`backend/server.js`)
```javascript
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
```
**Line-by-Line Explanation:**
- `require(...)`: Loads all necessary packages into the file.
- `require("dotenv").config();`: Loads secret variables (like our database password and API Key) from a hidden `.env` file so hackers can't see them on GitHub.
- `const app = express();`: Starts the backend server program.
- `app.use(cors({ origin: [...] }));`: Opens a gateway that allows our frontend websites to talk to the backend.
- `app.use(express.json());`: Automatically translates incoming data into a readable JavaScript format.

```javascript
// ─── POST /api/ask-ai ─────────────────────────────────────────────────────────
app.post("/api/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

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
          model: "google/gemma-3-4b-it:free",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
        }),
      }
    );

    const data = await openRouterRes.json();
    const answer = data.choices[0].message.content;
    res.json({ response: answer });
  } catch (err) {
    res.status(500).json({ error: "Failed to get AI response" });
  }
});
```
**Line-by-Line Explanation:**
- `app.post("/api/ask-ai", async (req, res) => {` : Sets up a URL endpoint for the frontend to hit.
- `const { prompt } = req.body;` : Extracts what the user typed.
- `if (!prompt)` : Defensive check. If the user sent nothing, we give back a 400 (Bad Request) error.
- `const openRouterRes = await fetch(...)` : Reaches out across the internet to the OpenRouter AI.
- `headers: { "Authorization": ... }` : Gives OpenRouter our secret API key to prove we are allowed to use it.
- `body: JSON.stringify({ ... messages: [{ role: "user", content: prompt }] })` : Formats the user's prompt exactly how the AI expects to read it.
- `const data = await openRouterRes.json();` : Translates the AI's complex response back into JSON.
- `const answer = data.choices[0].message.content;` : Digs deep into the AI's exact response object to isolate just the text string.
- `res.json({ response: answer });` : Sends the final AI answer back down to the frontend.

---

## 🎨 PART 3: The Frontend Code Explained Line-by-Line

### 1. `InputNode.jsx`
```javascript
import React from "react";
import { Handle, Position } from "@xyflow/react";

function InputNode({ data }) {
  return (
    <div className="input-node">
      <div className="node-label">✏️ Prompt Input</div>
      <textarea
        className="node-textarea"
        rows={5}
        value={data.prompt}
        onChange={(e) => data.onPromptChange(e.target.value)}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default InputNode;
```
**Line-by-Line Explanation:**
- `import { Handle, Position } from "@xyflow/react";` : Pulls customized tools from React Flow.
- `function InputNode({ data }) {` : A React component that takes `data` as a prop.
- `<textarea ... value={data.prompt} />` : Makes the text box display whatever the current "prompt" state is.
- `onChange={(e) => data.onPromptChange(e.target.value)}` : Every single time a user types a letter, this fires and updates the main `App.jsx` state immediately.
- `<Handle type="source" position={Position.Right} />` : This creates the visual "dot" on the right side of the box, allowing an animated line (Edge) to connect out of it.

### 2. `ResultNode.jsx`
```javascript
import React from "react";
import { Handle, Position } from "@xyflow/react";

function ResultNode({ data }) {
  return (
    <div className="result-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-label">🤖 AI Response</div>
      <div className="result-content">
        {data.isLoading ? (
          <span className="loading-dots">● ● ●</span>
        ) : data.response ? (
          data.response
        ) : (
          <span className="result-placeholder">Waiting...</span>
        )}
      </div>
    </div>
  );
}

export default ResultNode;
```
**Line-by-Line Explanation:**
- `<Handle type="target" position={Position.Left} />` : Places a connecting dot on the left side, meant to accept incoming lines.
- `{data.isLoading ? ( <span className="loading-dots">● ● ●</span> ) : ...}` : A ternary "if/else" statement. IF the app is loading, print dots. ELSE show the `data.response` AI text.

### 3. Canvas Logic (`App.jsx` Overview)

Because `App.jsx` is long, here is the focus on the heaviest logic block:

```javascript
  const handleRun = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");
    updateNodes("", true); // Sync nodes instantly

    try {
      const res = await fetch(`${BACKEND_URL}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      
      setResponse(data.response);
      updateNodes(data.response, false); 
      showToast("AI responded!", "success");
    } catch (err) {
      updateNodes("Error getting response.", false);
    } finally {
      setLoading(false);
    }
  };
```
**Line-by-Line Explanation:**
- `const handleRun = async () => {` : Triggered when you press "Run Flow".
- `if (!prompt.trim()) return;` : Prevents the user from sending empty spaces.
- `setLoading(true); setResponse("");` : Clears the old response and starts the loading dots.
- `updateNodes("", true);` : A custom function that forces the React Flow visual nodes to update instantly to match the state.
- `const res = await fetch(...)` : Contacts our backend server (`/api/ask-ai`), sending the prompt.
- `setResponse(data.response); updateNodes(...)` : Once we receive the answer, we update the state AND update the visual ResultNode data at the exact same time.
- `finally { setLoading(false); }` : Whether it succeeded or crashed, it turns the loading dots off at the very end.
