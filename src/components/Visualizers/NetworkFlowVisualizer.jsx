import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  ArrowRight, 
  Layers, 
  GitCommit, 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Droplets,
  Info 
} from 'lucide-react';

export default function NetworkFlowVisualizer({ algo }) {
  const isPushRelabel = algo?.id === 'push_relabel';

  // 6 vertices network layout
  const nodes = [
    { id: 0, label: 'S (0)', x: 60, y: 160, isSource: true },
    { id: 1, label: 'V1', x: 220, y: 70 },
    { id: 2, label: 'V2', x: 220, y: 250 },
    { id: 3, label: 'V3', x: 420, y: 70 },
    { id: 4, label: 'V4', x: 420, y: 250 },
    { id: 5, label: 'T (5)', x: 580, y: 160, isSink: true }
  ];

  // Ford Fulkerson Augmentation Steps
  const ffSteps = [
    {
      id: 0,
      title: 'Initial Zero Flow State',
      flow: 0,
      path: [],
      bottleneck: 0,
      desc: 'Residual graph equals capacity graph. All edge flows are 0. BFS searches for first shortest augmenting path from S to T.',
      edges: [
        { u: 0, v: 1, cap: 16, flow: 0 },
        { u: 0, v: 2, cap: 13, flow: 0 },
        { u: 1, v: 2, cap: 10, flow: 0 },
        { u: 1, v: 3, cap: 12, flow: 0 },
        { u: 2, v: 1, cap: 4, flow: 0 },
        { u: 2, v: 4, cap: 14, flow: 0 },
        { u: 3, v: 2, cap: 9, flow: 0 },
        { u: 3, v: 5, cap: 20, flow: 0 },
        { u: 4, v: 3, cap: 7, flow: 0 },
        { u: 4, v: 5, cap: 4, flow: 0 }
      ],
      cut: []
    },
    {
      id: 1,
      title: 'Augmenting Path 1: S -> V1 -> V3 -> T',
      flow: 12,
      path: [0, 1, 3, 5],
      bottleneck: 12,
      desc: 'BFS identifies path S -> V1 -> V3 -> T. Bottleneck edge is (V1 -> V3) with capacity 12. Pushed 12 units of flow.',
      edges: [
        { u: 0, v: 1, cap: 16, flow: 12 },
        { u: 0, v: 2, cap: 13, flow: 0 },
        { u: 1, v: 2, cap: 10, flow: 0 },
        { u: 1, v: 3, cap: 12, flow: 12 },
        { u: 2, v: 1, cap: 4, flow: 0 },
        { u: 2, v: 4, cap: 14, flow: 0 },
        { u: 3, v: 2, cap: 9, flow: 0 },
        { u: 3, v: 5, cap: 20, flow: 12 },
        { u: 4, v: 3, cap: 7, flow: 0 },
        { u: 4, v: 5, cap: 4, flow: 0 }
      ],
      cut: []
    },
    {
      id: 2,
      title: 'Augmenting Path 2: S -> V2 -> V4 -> T',
      flow: 16,
      path: [0, 2, 4, 5],
      bottleneck: 4,
      desc: 'BFS identifies path S -> V2 -> V4 -> T. Bottleneck edge is (V4 -> T) with capacity 4. Pushed 4 units. Total flow = 16.',
      edges: [
        { u: 0, v: 1, cap: 16, flow: 12 },
        { u: 0, v: 2, cap: 13, flow: 4 },
        { u: 1, v: 2, cap: 10, flow: 0 },
        { u: 1, v: 3, cap: 12, flow: 12 },
        { u: 2, v: 1, cap: 4, flow: 0 },
        { u: 2, v: 4, cap: 14, flow: 4 },
        { u: 3, v: 2, cap: 9, flow: 0 },
        { u: 3, v: 5, cap: 20, flow: 12 },
        { u: 4, v: 3, cap: 7, flow: 0 },
        { u: 4, v: 5, cap: 4, flow: 4 }
      ],
      cut: []
    },
    {
      id: 3,
      title: 'Augmenting Path 3: S -> V2 -> V4 -> V3 -> T',
      flow: 23,
      path: [0, 2, 4, 3, 5],
      bottleneck: 7,
      desc: 'BFS finds path S -> V2 -> V4 -> V3 -> T. Bottleneck edge is (V4 -> V3) with capacity 7. Pushed 7 units. Total flow = 23.',
      edges: [
        { u: 0, v: 1, cap: 16, flow: 12 },
        { u: 0, v: 2, cap: 13, flow: 11 },
        { u: 1, v: 2, cap: 10, flow: 0 },
        { u: 1, v: 3, cap: 12, flow: 12 },
        { u: 2, v: 1, cap: 4, flow: 0 },
        { u: 2, v: 4, cap: 14, flow: 11 },
        { u: 3, v: 2, cap: 9, flow: 0 },
        { u: 3, v: 5, cap: 20, flow: 19 },
        { u: 4, v: 3, cap: 7, flow: 7 },
        { u: 4, v: 5, cap: 4, flow: 4 }
      ],
      cut: []
    },
    {
      id: 4,
      title: 'Max-Flow Reached & Min-Cut Verified',
      flow: 23,
      path: [],
      bottleneck: 0,
      desc: 'No augmenting path exists from S to T in residual graph. Maximum Flow is 23. By Max-Flow Min-Cut Theorem, capacity of cut {S, V1, V2, V4} : {V3, T} = 23.',
      edges: [
        { u: 0, v: 1, cap: 16, flow: 12 },
        { u: 0, v: 2, cap: 13, flow: 11 },
        { u: 1, v: 2, cap: 10, flow: 0 },
        { u: 1, v: 3, cap: 12, flow: 12 },
        { u: 2, v: 1, cap: 4, flow: 0 },
        { u: 2, v: 4, cap: 14, flow: 11 },
        { u: 3, v: 2, cap: 9, flow: 0 },
        { u: 3, v: 5, cap: 20, flow: 19 },
        { u: 4, v: 3, cap: 7, flow: 7 },
        { u: 4, v: 5, cap: 4, flow: 4 }
      ],
      cut: [0, 1, 2, 4]
    }
  ];

  // Push Relabel Steps
  const prSteps = [
    {
      id: 0,
      title: 'Initialize Preflow: Height(S)=6, Saturate outgoing S-edges',
      flow: 0,
      activeNode: 0,
      action: 'preflow',
      desc: 'Height of source S set to V=6. Outgoing edges (S->V1) cap 16 and (S->V2) cap 13 saturated. Excess(V1)=16, Excess(V2)=13.',
      heights: [6, 0, 0, 0, 0, 0],
      excess: [0, 16, 13, 0, 0, 0],
      pushes: 2,
      relabels: 0
    },
    {
      id: 1,
      title: 'Relabel V1 (h=1) & Push to V3',
      flow: 12,
      activeNode: 1,
      action: 'push',
      desc: 'V1 has excess 16 but h(V1) <= h(V3). Relabeled V1 to h=1. Pushed 12 to V3 (cap 12 saturated). Excess(V1)=4, Excess(V3)=12.',
      heights: [6, 1, 0, 0, 0, 0],
      excess: [0, 4, 13, 12, 0, 0],
      pushes: 3,
      relabels: 1
    },
    {
      id: 2,
      title: 'Relabel V3 (h=1) & Push to Sink T',
      flow: 12,
      activeNode: 3,
      action: 'push',
      desc: 'V3 has excess 12. Relabeled V3 to h=1. Pushed 12 to Sink T (h=0). Excess(T)=12, Excess(V3)=0.',
      heights: [6, 1, 0, 1, 0, 0],
      excess: [0, 4, 13, 0, 0, 12],
      pushes: 4,
      relabels: 2
    },
    {
      id: 3,
      title: 'Push-Relabel Propagation through V2 & V4',
      flow: 16,
      activeNode: 2,
      action: 'push_relabel',
      desc: 'V2 relabeled to h=1, pushes 4 to V4. V4 relabeled to h=1, pushes 4 to Sink T. Excess(T) increases to 16.',
      heights: [6, 1, 1, 1, 1, 0],
      excess: [0, 4, 9, 0, 0, 16],
      pushes: 8,
      relabels: 5
    },
    {
      id: 4,
      title: 'Discharging Excess: Final Max Flow Converged to 23',
      flow: 23,
      activeNode: -1,
      action: 'done',
      desc: 'All internal excess pushed forward or returned to source S. Excess at Sink T = 23 units. Max Flow = 23.',
      heights: [6, 7, 7, 1, 1, 0],
      excess: [0, 0, 0, 0, 0, 23],
      pushes: 16,
      relabels: 13
    }
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = isPushRelabel ? prSteps : ffSteps;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [algo?.id]);

  const defaultEdges = [
    { u: 0, v: 1, cap: 16, flow: 12 },
    { u: 0, v: 2, cap: 13, flow: 11 },
    { u: 1, v: 2, cap: 10, flow: 0 },
    { u: 1, v: 3, cap: 12, flow: 12 },
    { u: 2, v: 1, cap: 4, flow: 0 },
    { u: 2, v: 4, cap: 14, flow: 11 },
    { u: 3, v: 2, cap: 9, flow: 0 },
    { u: 3, v: 5, cap: 20, flow: 19 },
    { u: 4, v: 3, cap: 7, flow: 7 },
    { u: 4, v: 5, cap: 4, flow: 4 }
  ];

  const currentEdges = !isPushRelabel && currentStep.edges ? currentStep.edges : defaultEdges;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(59, 130, 246, 0.08))',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Droplets size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                Network Flow Theory
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
                {isPushRelabel ? 'Push-Relabel Algorithm (Goldberg-Tarjan)' : 'Ford-Fulkerson Method (Edmonds-Karp BFS)'}
              </h3>
            </div>
          </div>

          <span style={{
            fontSize: '0.8rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-emerald)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontWeight: '600'
          }}>
            {isPushRelabel ? 'Complexity: O(V²E) / O(V³)' : 'Complexity: O(V·E²)'}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {isPushRelabel
            ? 'Push-Relabel works locally by maintaining a preflow with excess vertices and height labels. Flow is pushed downhill (height difference = 1), and vertices are relabeled when trapped. Ideal for dense flow networks.'
            : 'Ford-Fulkerson (Edmonds-Karp) repeatedly finds shortest augmenting paths in the residual network via Breadth-First Search (BFS) and augments flow until no path connects Source to Sink.'}
        </p>
      </div>

      {/* Playback Controls & Status */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-primary" 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => setStepIndex(prev => Math.min(prev + 1, steps.length - 1))}
            disabled={stepIndex >= steps.length - 1}
          >
            <span>Next Step ({stepIndex + 1}/{steps.length})</span>
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => { setStepIndex(0); setIsPlaying(false); }}
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-dim)' }}>Current Step:</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
            {currentStep.title}
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Droplets size={30} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Accumulated Max Flow</div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              {currentStep.flow} / 23 units
            </div>
          </div>
        </div>

        {!isPushRelabel ? (
          <>
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <GitCommit size={30} color="var(--accent-emerald)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current Augmenting Path</div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.path.length > 0 ? currentStep.path.join(' -> ') : 'None / Terminated'}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Zap size={30} color="var(--accent-amber)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Path Bottleneck Capacity</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.bottleneck > 0 ? `+${currentStep.bottleneck}` : '0'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Zap size={30} color="var(--accent-purple)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Push Operations</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.pushes} pushes
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Layers size={30} color="var(--accent-amber)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Relabel Operations</div>
                <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.relabels} relabels
                </div>
              </div>
            </div>
          </>
        )}

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={30} color="var(--accent-emerald)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Max-Flow Min-Cut Status</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
              {currentStep.flow === 23 ? 'Optimal Cut Verified' : 'In Progress'}
            </div>
          </div>
        </div>
      </div>

      {/* Step Insight Box */}
      <div className="glass-card" style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        background: 'rgba(30, 41, 59, 0.9)',
        borderLeft: '4px solid var(--accent-cyan)'
      }}>
        <Info size={20} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.5' }}>
          <strong style={{ color: '#fff', marginRight: '0.5rem' }}>Step {stepIndex + 1} State:</strong>
          {currentStep.desc}
        </div>
      </div>

      {/* Network Graph Interactive Visualization */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700' }}>
            Flow Network Graph (Source S = 0, Sink T = 5)
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
              Source (S) / Active
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></span>
              Sink (T) / Path Edge
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-rose)' }}></span>
              Saturated Edge
            </span>
          </div>
        </div>

        {/* SVG Flow Canvas */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '340px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          <svg width="100%" height="100%">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255, 255, 255, 0.4)" />
              </marker>
              <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-emerald)" />
              </marker>
            </defs>

            {/* Draw Directed Edges */}
            {currentEdges.map((edge, idx) => {
              const uNode = nodes[edge.u];
              const vNode = nodes[edge.v];
              const isPath = !isPushRelabel && currentStep.path && currentStep.path.includes(edge.u) && currentStep.path.includes(edge.v) && (currentStep.path.indexOf(edge.v) === currentStep.path.indexOf(edge.u) + 1);
              const isSaturated = edge.flow === edge.cap && edge.cap > 0;

              let strokeColor = 'rgba(255, 255, 255, 0.2)';
              let strokeWidth = '2';

              if (isPath) {
                strokeColor = 'var(--accent-emerald)';
                strokeWidth = '3.5';
              } else if (isSaturated) {
                strokeColor = 'var(--accent-rose)';
                strokeWidth = '2.5';
              } else if (edge.flow > 0) {
                strokeColor = 'var(--accent-cyan)';
                strokeWidth = '2.5';
              }

              // Compute mid point
              const midX = (uNode.x + vNode.x) / 2;
              const midY = (uNode.y + vNode.y) / 2;

              return (
                <g key={idx}>
                  <line 
                    x1={uNode.x} 
                    y1={uNode.y} 
                    x2={vNode.x} 
                    y2={vNode.y} 
                    stroke={strokeColor} 
                    strokeWidth={strokeWidth} 
                    markerEnd={isPath ? "url(#arrow-active)" : "url(#arrow)"} 
                  />
                  <rect 
                    x={midX - 22} 
                    y={midY - 10} 
                    width="44" 
                    height="18" 
                    rx="4" 
                    fill="rgba(15, 23, 42, 0.9)" 
                    stroke={strokeColor} 
                    strokeWidth="1" 
                  />
                  <text 
                    x={midX} 
                    y={midY + 3} 
                    fill={isSaturated ? 'var(--accent-rose)' : isPath ? 'var(--accent-emerald)' : '#e2e8f0'} 
                    fontSize="10" 
                    fontWeight="700" 
                    textAnchor="middle" 
                    fontFamily="var(--font-mono)"
                  >
                    {edge.flow}/{edge.cap}
                  </text>
                </g>
              );
            })}

            {/* Draw Vertices */}
            {nodes.map(n => {
              const isActive = isPushRelabel && currentStep.activeNode === n.id;
              const isCutSourceSide = !isPushRelabel && currentStep.cut && currentStep.cut.includes(n.id);

              let fillColor = 'rgba(30, 41, 59, 0.95)';
              let strokeColor = 'rgba(255, 255, 255, 0.4)';

              if (n.isSource) {
                fillColor = 'var(--accent-cyan)';
                strokeColor = '#fff';
              } else if (n.isSink) {
                fillColor = 'var(--accent-emerald)';
                strokeColor = '#fff';
              } else if (isActive) {
                fillColor = 'var(--accent-purple)';
                strokeColor = '#fff';
              } else if (isCutSourceSide) {
                fillColor = 'rgba(6, 182, 212, 0.3)';
                strokeColor = 'var(--accent-cyan)';
              }

              const heightVal = isPushRelabel && currentStep.heights ? currentStep.heights[n.id] : null;
              const excessVal = isPushRelabel && currentStep.excess ? currentStep.excess[n.id] : null;

              return (
                <g key={n.id}>
                  <circle 
                    cx={n.x} 
                    cy={n.y} 
                    r={isActive ? 22 : 18} 
                    fill={fillColor} 
                    stroke={strokeColor} 
                    strokeWidth="2.5" 
                  />
                  <text 
                    x={n.x} 
                    y={n.y + 4} 
                    fill="#fff" 
                    fontSize="11" 
                    fontWeight="800" 
                    textAnchor="middle"
                  >
                    {n.label}
                  </text>

                  {/* Push Relabel Height & Excess Badges */}
                  {isPushRelabel && (
                    <>
                      <text 
                        x={n.x} 
                        y={n.y - 24} 
                        fill="var(--accent-amber)" 
                        fontSize="10" 
                        fontWeight="700" 
                        textAnchor="middle" 
                        fontFamily="var(--font-mono)"
                      >
                        h={heightVal}
                      </text>
                      <text 
                        x={n.x} 
                        y={n.y + 32} 
                        fill={excessVal > 0 ? 'var(--accent-rose)' : 'var(--text-dim)'} 
                        fontSize="10" 
                        fontWeight="700" 
                        textAnchor="middle" 
                        fontFamily="var(--font-mono)"
                      >
                        e={excessVal}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Comparison Analysis Table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '0.85rem' }}>
          Comparative Evaluation: Ford-Fulkerson vs. Push-Relabel
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem' }}>Criteria</th>
                <th style={{ padding: '0.65rem' }}>Ford-Fulkerson (Edmonds-Karp)</th>
                <th style={{ padding: '0.65rem' }}>Push-Relabel (Goldberg-Tarjan)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Algorithm Paradigm</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)' }}>Global Augmenting Paths (BFS/DFS on entire graph)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-purple)' }}>Local Node Operations (Preflow, Push & Relabel)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Time Complexity (General)</td>
                <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>O(V · E²)</td>
                <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>O(V² · E) or O(V³) with FIFO queue</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Performance on Dense Graphs (E ~ V²)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)' }}>Slower: O(V⁵)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>Fast: O(V³) with highest-label selection</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Space Complexity</td>
                <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>O(V + E)</td>
                <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>O(V²) capacity & flow matrices</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Real-World Applicability</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>
                  Bipartite matching, job assignment, small-to-medium networks where simplicity is key
                </td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)' }}>
                  Large dense telecommunication networks, image segmentation (min-cut), airline flight scheduling
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
