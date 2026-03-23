import { Handle, Position } from "@xyflow/react";

export default function ResultNode({ data }) {
  return (
    <div className="flow-node result-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <span className="node-icon">🤖</span>
        <span className="node-title">AI Response</span>
        <span className="node-badge result-badge">OUTPUT</span>
      </div>
      <div className="node-body">
        {data.loading ? (
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        ) : data.response ? (
          <div className="response-text">{data.response}</div>
        ) : (
          <div className="empty-state">Response will appear here...</div>
        )}
      </div>
    </div>
  );
}
