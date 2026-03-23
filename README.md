# AI Flow App 🤖

A MERN stack application where users can type prompts into a React Flow node, get AI responses via OpenRouter, and save conversations to MongoDB.

## Tech Stack
- **Frontend**: React + Vite + React Flow
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)
- **AI**: OpenRouter API (Mistral 7B - free model)

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- A MongoDB Atlas account (free) → https://www.mongodb.com/atlas
- An OpenRouter account (free) → https://openrouter.ai

---

### Step 1 – Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-flow-app.git
cd ai-flow-app
```

---

### Step 2 – Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/aiflowapp
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxx
PORT=5000
```

Start the backend:
```bash
npm run dev
```

Server runs on → http://localhost:5000

---

### Step 3 – Set up the Frontend

```bash
cd ../frontend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

The default `.env` is:
```
VITE_BACKEND_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

App runs on → http://localhost:5173

---

## 🧪 How to Use

1. Type any question in the **Prompt** node (left box)
2. Click **▶ Run Flow** in the top bar
3. The AI response appears in the **AI Response** node (right box)
4. Click **💾 Save to DB** to save the Q&A to MongoDB

---

## 🚀 Deployment (Render.com)

### Backend on Render
1. Go to https://render.com → New → **Web Service**
2. Connect your GitHub repo, select the `backend` folder
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI` = your MongoDB connection string
   - `OPENROUTER_API_KEY` = your key
6. Deploy!

### Frontend on Render
1. New → **Static Site**
2. Connect repo, select the `frontend` folder
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Add Environment Variable:
   - `VITE_BACKEND_URL` = your backend Render URL (e.g. `https://ai-flow-backend.onrender.com`)
6. Deploy!

---

## 📁 Project Structure

```
ai-flow-app/
├── backend/
│   ├── server.js          ← Express server + API routes
│   ├── package.json
│   └── .env.example       ← Copy to .env and fill values
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        ← Main app with React Flow
│   │   ├── App.css        ← All styles
│   │   ├── index.css      ← Global + React Flow overrides
│   │   ├── main.jsx       ← React entry point
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

## 🔑 Getting API Keys

### MongoDB Atlas (free)
1. Sign up at https://cloud.mongodb.com
2. Create a free cluster
3. Database Access → Add user → remember username & password
4. Network Access → Add `0.0.0.0/0` (allow all IPs for dev)
5. Connect → Drivers → copy the connection string
6. Replace `<password>` with your actual password

### OpenRouter (free)
1. Sign up at https://openrouter.ai
2. Go to Keys → Create Key
3. Copy your `sk-or-v1-...` key
