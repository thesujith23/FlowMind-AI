import { Handle, Position } from "@xyflow/react";

export default function InputNode({ data }) {
  return (
    <div className="flow-node input-node">
      <div className="node-header">
        <span className="node-icon">✏️</span>
        <span className="node-title">Prompt</span>
        <span className="node-badge">INPUT</span>
      </div>
      <div className="node-body">
        <textarea
          className="node-textarea"
          placeholder="Ask me anything..."
          value={data.prompt}
          onChange={(e) => data.onPromptChange(e.target.value)}
          rows={5}
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
