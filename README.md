# FlowMind AI 🤖

> A visual AI conversation builder — type prompts into interactive nodes, get AI responses, and save everything to MongoDB.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?style=flat-square&logo=react)
![AI](https://img.shields.io/badge/AI-OpenRouter%20%7C%20Mistral%207B-orange?style=flat-square)
![Deployed](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🧠 What is FlowMind AI?

FlowMind AI is a full-stack MERN application that combines **React Flow** with an **AI backend** to create an interactive, node-based chat experience. Instead of a plain chat box, users interact with a visual flow canvas — type a prompt in the left node, hit Run, and the AI response populates the right node in real time. Conversations can be saved to MongoDB for persistence.

---

## ✨ Features

- 🔲 **Visual Node Interface** — Prompt and response rendered as React Flow nodes on a canvas
- 🤖 **AI-Powered Responses** — Integrated with OpenRouter API using Mistral 7B (free tier)
- 💾 **Save to MongoDB** — Persist Q&A sessions to database with a single click
- ⚡ **Fast & Lightweight** — Vite-powered React frontend with minimal overhead
- 🌐 **Fully Deployed** — Frontend on Vercel, backend on Render

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React + Vite + React Flow           |
| Backend    | Node.js + Express.js                |
| Database   | MongoDB (Mongoose)                  |
| AI Model   | OpenRouter API — Mistral 7B (free)  |
| Deployment | Vercel (frontend) + Render (backend)|

---

## 🚀 Live Demo

🔗 [flow-mind-ai-eta.vercel.app](https://flow-mind-ai-eta.vercel.app)

---

## 📁 Project Structure

```
FlowMind-AI/
├── backend/
│   ├── server.js          ← Express server + API routes
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        ← Main app with React Flow canvas
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── nodes/
│   │       ├── InputNode.jsx   ← Left node (prompt input)
│   │       └── ResultNode.jsx  ← Right node (AI response)
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example
│
└── README.md
```

---

## ⚡ Getting Started (Local Setup)

### Prerequisites

- Node.js v18+
- MongoDB Atlas account → [mongodb.com/atlas](https://www.mongodb.com/atlas)
- OpenRouter account → [openrouter.ai](https://openrouter.ai)

---

### 1. Clone the Repository

```bash
git clone https://github.com/thesujith23/FlowMind-AI.git
cd FlowMind-AI
```

---

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/aiflowapp
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxx
PORT=5000
```

Start the server:

```bash
npm run dev
```

Backend runs on → `http://localhost:5000`

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Default `.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Start the app:

```bash
npm run dev
```

Frontend runs on → `http://localhost:5173`

---

## 🧪 How to Use

1. Open the app — you'll see a two-node canvas
2. Type any question in the **Prompt** node (left)
3. Click **▶ Run Flow** in the top bar
4. AI response appears in the **AI Response** node (right)
5. Click **💾 Save to DB** to persist the Q&A to MongoDB

---

## 🔑 Getting API Keys

### MongoDB Atlas (Free)

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. **Database Access** → Add a new user (save the password)
4. **Network Access** → Add `0.0.0.0/0` (allow all IPs for dev)
5. **Connect** → Drivers → Copy the connection string
6. Replace `<password>` with your actual password

### OpenRouter (Free)

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to **Keys** → Create Key
3. Copy your `sk-or-v1-...` key

---

## 🚀 Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repo, select the `backend` folder
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`
5. Add environment variables:
   - `MONGO_URI` = your MongoDB connection string
   - `OPENROUTER_API_KEY` = your key
6. Deploy!

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import the repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_BACKEND_URL` = your Render backend URL (e.g. `https://ai-flow-backend.onrender.com`)
4. Deploy!

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍💻 Author

**Sujith** — [github.com/thesujith23](https://github.com/thesujith23)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
