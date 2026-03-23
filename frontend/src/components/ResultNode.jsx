import React from "react";
import { Handle, Position } from "@xyflow/react";

function ResultNode({ data }) {
  return (
    <div className="result-node">
      {/* Handle is the connection dot on the left side */}
      <Handle type="target" position={Position.Left} />
      <div className="node-label">🤖 AI Response</div>
      <div className="result-content">
        {data.isLoading ? (
          <span className="loading-dots">● ● ●</span>
        ) : data.response ? (
          data.response
        ) : (
          <span className="result-placeholder">
            AI response will appear here after you click Run Flow.
          </span>
        )}
      </div>
    </div>
  );
}

export default ResultNode;
