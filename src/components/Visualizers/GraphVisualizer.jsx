import React, { useState } from 'react';
import { Play, RotateCcw, Network } from 'lucide-react';

export default function GraphVisualizer({ algo }) {
  const [visitedNodes, setVisitedNodes] = useState([0]);
  const [activeEdge, setActiveEdge] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  // Graph topology definition
  const nodes = [
    { id: 0, label: '0', x: 80, y: 150 },
    { id: 1, label: '1', x: 220, y: 70 },
    { id: 2, label: '2', x: 220, y: 230 },
    { id: 3, label: '3', x: 380, y: 70 },
    { id: 4, label: '4', x: 380, y: 230 },
    { id: 5, label: '5', x: 520, y: 150 }
  ];

  const edges = [
    { u: 0, v: 1, w: 4 },
    { u: 0, v: 2, w: 2 },
    { u: 1, v: 2, w: 1 },
    { u: 1, v: 3, w: 5 },
    { u: 2, v: 3, w: 8 },
    { u: 2, v: 4, w: 10 },
    { u: 3, v: 4, w: 2 },
    { u: 3, v: 5, w: 6 },
    { u: 4, v: 5, w: 3 }
  ];

  // Execution trace steps
  const stepsTrace = [
    { node: 0, dists: [0, '∞', '∞', '∞', '∞', '∞'], edge: null, desc: 'Start at Source Node 0 (Distance = 0)' },
    { node: 2, dists: [0, 4, 2, '∞', '∞', '∞'], edge: { u: 0, v: 2 }, desc: 'Relax edge (0,2): Dist to Node 2 becomes 2' },
    { node: 1, dists: [0, 3, 2, '∞', '∞', '∞'], edge: { u: 2, v: 1 }, desc: 'Relax edge (2,1): Dist to Node 1 updated to 3' },
    { node: 3, dists: [0, 3, 2, 8, '∞', '∞'], edge: { u: 1, v: 3 }, desc: 'Relax edge (1,3): Dist to Node 3 becomes 8' },
    { node: 4, dists: [0, 3, 2, 8, 10, '∞'], edge: { u: 3, v: 4 }, desc: 'Relax edge (3,4): Dist to Node 4 updated to 10' },
    { node: 5, dists: [0, 3, 2, 8, 10, 13], edge: { u: 4, v: 5 }, desc: 'Relax edge (4,5): Dist to Node 5 becomes 13' }
  ];

  const handleNextStep = () => {
    if (stepIndex < stepsTrace.length - 1) {
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);
      setVisitedNodes(prev => [...new Set([...prev, stepsTrace[nextStep].node])]);
      setActiveEdge(stepsTrace[nextStep].edge);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setVisitedNodes([0]);
    setActiveEdge(null);
  };

  const currentStep = stepsTrace[stepIndex];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Control bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={handleNextStep} disabled={stepIndex >= stepsTrace.length - 1}>
            <Play size={16} />
            <span>Next Step ({stepIndex + 1}/{stepsTrace.length})</span>
          </button>
          <button className="btn-secondary" onClick={handleReset}>
            <RotateCcw size={16} />
            <span>Reset Trace</span>
          </button>
        </div>

        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: '600' }}>
          {currentStep.desc}
        </div>
      </div>

      {/* SVG Canvas and Distance Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {/* Interactive SVG Graph Area */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="600" height="300" viewBox="0 0 600 300">
            {/* Draw Edges */}
            {edges.map((e, idx) => {
              const uNode = nodes.find(n => n.id === e.u);
              const vNode = nodes.find(n => n.id === e.v);
              const isActive = activeEdge && ((activeEdge.u === e.u && activeEdge.v === e.v) || (activeEdge.u === e.v && activeEdge.v === e.u));

              return (
                <g key={idx}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={isActive ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth={isActive ? '4' : '2'}
                  />
                  <text
                    x={(uNode.x + vNode.x) / 2}
                    y={(uNode.y + vNode.y) / 2 - 6}
                    fill="var(--text-muted)"
                    fontSize="12"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {e.w}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map(n => {
              const isVisited = visitedNodes.includes(n.id);
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="22"
                    fill={isVisited ? 'var(--accent-indigo)' : 'var(--bg-dark)'}
                    stroke={isVisited ? 'var(--accent-purple)' : 'var(--border-color)'}
                    strokeWidth="3"
                  />
                  <text
                    x={n.x}
                    y={n.y + 5}
                    fill="#fff"
                    fontSize="14"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Live Distance Table */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
            <Network size={18} color="var(--accent-indigo)" />
            <span>Shortest Distance Table</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Node</th>
                <th style={{ padding: '0.5rem' }}>Status</th>
                <th style={{ padding: '0.5rem' }}>Shortest Distance</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map(n => {
                const isVisited = visitedNodes.includes(n.id);
                return (
                  <tr key={n.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.6rem', fontWeight: '700', color: '#fff' }}>Node {n.id}</td>
                    <td style={{ padding: '0.6rem' }}>
                      <span style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        background: isVisited ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: isVisited ? 'var(--accent-emerald)' : 'var(--text-dim)'
                      }}>
                        {isVisited ? 'Visited' : 'Unvisited'}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      {currentStep.dists[n.id]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
