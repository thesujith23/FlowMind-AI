import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import InputNode from "./nodes/InputNode";
import ResultNode from "./nodes/ResultNode";
import "./App.css";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const initialNodes = [
    {
      id: "1",
      type: "inputNode",
      position: { x: 80, y: 180 },
      data: { prompt, onPromptChange: setPrompt },
    },
    {
      id: "2",
      type: "resultNode",
      position: { x: 520, y: 180 },
      data: { response, loading },
    },
  ];

  const initialEdges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "#7c6aff", strokeWidth: 2 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync node data with state changes
  const updateNodes = useCallback(
    (newResponse, newLoading) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === "1") {
            return { ...node, data: { ...node.data, prompt } };
          }
          if (node.id === "2") {
            return { ...node, data: { ...node.data, response: newResponse, loading: newLoading } };
          }
          return node;
        })
      );
    },
    [prompt, setNodes]
  );

  // Handle prompt changes and sync to node
  const handlePromptChange = useCallback(
    (val) => {
      setPrompt(val);
      setNodes((nds) =>
        nds.map((n) =>
          n.id === "1"
            ? { ...n, data: { ...n.data, prompt: val, onPromptChange: handlePromptChange } }
            : n
        )
      );
    },
    [setNodes]
  );

  // Initialize nodes with correct handlers
  useState(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === "1"
          ? { ...n, data: { ...n.data, onPromptChange: handlePromptChange } }
          : n
      )
    );
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // ── Run Flow ────────────────────────────────────────────────────────────────
  const handleRun = async () => {
    if (!prompt.trim()) {
      showToast("Please type a prompt first!", "error");
      return;
    }
    setLoading(true);
    setResponse("");
    updateNodes("", true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data.response);
      updateNodes(data.response, false);
      showToast("AI responded!", "success");
    } catch (err) {
      showToast("Error: " + err.message, "error");
      updateNodes("Error getting response.", false);
    } finally {
      setLoading(false);
    }
  };

  // ── Clear ───────────────────────────────────────────────────────────────────
  const handleClear = () => {
    setPrompt("");
    setResponse("");
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === "1") return { ...n, data: { ...n.data, prompt: "" } };
        if (n.id === "2") return { ...n, data: { ...n.data, response: "", loading: false } };
        return n;
      })
    );
    showToast("Cleared flow!", "success");
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!prompt || !response) {
      showToast("Run the flow first before saving!", "error");
      return;
    }
    setSaveStatus("saving");
    try {
      const res = await fetch(`${BACKEND_URL}/api/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSaveStatus("saved");
      showToast("Saved to MongoDB! 🎉", "success");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
      setSaveStatus("");
    }
  };

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">◈</div>
          <div>
            <h1 className="app-title">AI Flow</h1>
            <p className="app-subtitle">Prompt → AI → Result</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-clear"
            onClick={handleClear}
            disabled={loading}
          >
            🗑️ Clear
          </button>
          <button
            className={`btn btn-save ${saveStatus === "saved" ? "saved" : ""}`}
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
              ? "✓ Saved"
              : "💾 Save to DB"}
          </button>
          <button
            className={`btn btn-run ${loading ? "loading" : ""}`}
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Running...
              </>
            ) : (
              "▶ Run Flow"
            )}
          </button>
        </div>
      </header>

      {/* ── React Flow Canvas ── */}
      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
        >
          <Background color="#2a2a3d" gap={24} size={1} />
          <Controls />
          <MiniMap
            nodeColor="#7c6aff"
            maskColor="rgba(10,10,15,0.7)"
          />
        </ReactFlow>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}
