import React from "react";
import { Handle, Position } from "@xyflow/react";

function InputNode({ data }) {
  return (
    <div className="input-node">
      <div className="node-label">✏️ Prompt Input</div>
      <textarea
        className="node-textarea"
        rows={5}
        placeholder="Type your prompt here... e.g. What is the capital of France?"
        value={data.prompt}
        onChange={(e) => data.onPromptChange(e.target.value)}
      />
      {/* Handle is the connection dot on the right side */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default InputNode;
