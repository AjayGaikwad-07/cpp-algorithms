import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Grid, Layers, Cpu, CheckCircle2 } from 'lucide-react';

export default function DynamicProgrammingVisualizer({ algo }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
  }, [algo.id]);

  // Visualizer data sets based on algo.id
  const getVisualizerData = () => {
    if (algo.id === 'mcm') {
      const matrices = [
        { name: 'A1', dim: '10×30' },
        { name: 'A2', dim: '30×5' },
        { name: 'A3', dim: '5×60' },
        { name: 'A4', dim: '60×8' }
      ];
      const steps = [
        { desc: 'Base Case: Single matrix subproblems (len = 1) cost 0 multiplications.', chainLen: 1, activeCell: null, minCost: 0, table: [
          [0, '-', '-', '-'],
          ['-', 0, '-', '-'],
          ['-', '-', 0, '-'],
          ['-', '-', '-', 0]
        ]},
        { desc: 'Chain Length 2: Calculating m[1][2], m[2][3], m[3][4]...', chainLen: 2, activeCell: 'm[1][2]', minCost: 1500, table: [
          [0, 1500, '-', '-'],
          ['-', 0, 9000, '-'],
          ['-', '-', 0, 2400]
        ]},
        { desc: 'Chain Length 3: Calculating m[1][3] and m[2][4] via optimal splits.', chainLen: 3, activeCell: 'm[1][3]', minCost: 4500, table: [
          [0, 1500, 4500, '-'],
          ['-', 0, 9000, 3600],
          ['-', '-', 0, 2400]
        ]},
        { desc: 'Chain Length 4 (Final): Optimal parenthesization (A1(A2 A3))A4 = 4,500 scalar multiplications.', chainLen: 4, activeCell: 'm[1][4]', minCost: 4500, table: [
          [0, 1500, 4500, 4500],
          ['-', 0, 9000, 3600],
          ['-', '-', 0, 2400],
          ['-', '-', '-', 0]
        ]}
      ];
      return { matrices, steps, type: 'mcm' };
    }

    if (algo.id === 'lcs') {
      const s1 = "AGGTAB";
      const s2 = "GXTXAYB";
      const steps = [
        { desc: 'Initialization: DP table filled with 0 for empty string prefixes.', active: [0, 0], lcsSoFar: '' },
        { desc: 'Comparing s1[0]="A" with s2[0...6]: Match found at s2[4]="A" -> dp[1][5] = 1.', active: [1, 5], lcsSoFar: 'A' },
        { desc: 'Comparing s1[1,2]="G": Matches s2[0]="G" -> dp[3][1] = 1.', active: [3, 1], lcsSoFar: 'G' },
        { desc: 'Matching s1[3]="T" with s2[2]="T" -> dp[4][3] = 2 ("GT").', active: [4, 3], lcsSoFar: 'GT' },
        { desc: 'Matching s1[4]="A" with s2[4]="A" -> dp[5][5] = 3 ("GTA").', active: [5, 5], lcsSoFar: 'GTA' },
        { desc: 'Matching s1[5]="B" with s2[6]="B" -> dp[6][7] = 4 ("GTAB"). Final LCS Length = 4.', active: [6, 7], lcsSoFar: 'GTAB' }
      ];
      return { s1, s2, steps, type: 'lcs' };
    }

    if (algo.id === 'knapsack01') {
      const items = [
        { id: 1, val: 60, wt: 10 },
        { id: 2, val: 100, wt: 20 },
        { id: 3, val: 120, wt: 30 }
      ];
      const steps = [
        { capacity: 50, itemIdx: 0, desc: 'Base Case: DP matrix dp[item][cap] initialized to 0.', maxProfit: 0 },
        { capacity: 50, itemIdx: 1, desc: 'Item 1 (val: 60, wt: 10): Include item 1 for capacity >= 10 -> dp[1][50] = 60.', maxProfit: 60 },
        { capacity: 50, itemIdx: 2, desc: 'Item 2 (val: 100, wt: 20): Combine item 1 & 2 -> dp[2][50] = 160.', maxProfit: 160 },
        { capacity: 50, itemIdx: 3, desc: 'Item 3 (val: 120, wt: 30): Optimal choice combines Item 2 & 3 -> Total Max Value = $220.', maxProfit: 220 }
      ];
      return { items, steps, type: 'knapsack' };
    }

    if (algo.id === 'floyd_warshall') {
      const steps = [
        { k: -1, desc: 'Initial Adjacency Distance Matrix (INF for unreachable vertices).', matrix: [
          [0, 5, 'INF', 10],
          ['INF', 0, 3, 'INF'],
          ['INF', 'INF', 0, 1],
          ['INF', 'INF', 'INF', 0]
        ]},
        { k: 0, desc: 'Relaxing via Vertex k = 0: No shorter paths found through node 0.', matrix: [
          [0, 5, 'INF', 10],
          ['INF', 0, 3, 'INF'],
          ['INF', 'INF', 0, 1],
          ['INF', 'INF', 'INF', 0]
        ]},
        { k: 1, desc: 'Relaxing via Vertex k = 1: Updated dist[0][2] = dist[0][1] + dist[1][2] = 5 + 3 = 8.', matrix: [
          [0, 5, 8, 10],
          ['INF', 0, 3, 'INF'],
          ['INF', 'INF', 0, 1],
          ['INF', 'INF', 'INF', 0]
        ]},
        { k: 2, desc: 'Relaxing via Vertex k = 2: Updated dist[0][3] = 8 + 1 = 9, dist[1][3] = 3 + 1 = 4.', matrix: [
          [0, 5, 8, 9],
          ['INF', 0, 3, 4],
          ['INF', 'INF', 0, 1],
          ['INF', 'INF', 'INF', 0]
        ]},
        { k: 3, desc: 'Relaxing via Vertex k = 3 (Final): All-Pairs Shortest Path Matrix complete!', matrix: [
          [0, 5, 8, 9],
          ['INF', 0, 3, 4],
          ['INF', 'INF', 0, 1],
          ['INF', 'INF', 'INF', 0]
        ]}
      ];
      return { steps, type: 'floyd' };
    }

    // Bellman-Ford
    const steps = [
      { step: 0, desc: 'Initialization: dist[0] = 0, all other nodes = INF.', dist: [0, 'INF', 'INF', 'INF', 'INF'] },
      { step: 1, desc: 'Relaxation Pass 1: Relax edges from source 0 -> dist[1]=-1, dist[2]=4.', dist: [0, -1, 4, 'INF', 'INF'] },
      { step: 2, desc: 'Relaxation Pass 2: Relax edges from node 1 -> dist[2]=2, dist[3]=1, dist[4]=1.', dist: [0, -1, 2, 1, 1] },
      { step: 3, desc: 'Relaxation Pass 3: Relax node 4 -> 3 (weight -3): dist[3] = 1 + (-3) = -2.', dist: [0, -1, 2, -2, 1] },
      { step: 4, desc: 'Relaxation Pass 4 (Final): No further changes. Verified NO negative cycles exist!', dist: [0, -1, 2, -2, 1] }
    ];
    return { steps, type: 'bellman' };
  };

  const data = getVisualizerData();
  const currentStep = data.steps[stepIndex] || data.steps[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls Header */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn-primary" 
            onClick={() => setStepIndex(prev => Math.min(prev + 1, data.steps.length - 1))} 
            disabled={stepIndex >= data.steps.length - 1}
          >
            <Play size={16} />
            <span>Next DP Step ({stepIndex + 1}/{data.steps.length})</span>
          </button>
          <button className="btn-secondary" onClick={() => setStepIndex(0)}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: '600' }}>
          {currentStep.desc}
        </div>
      </div>

      {/* Dynamic Content View */}
      {data.type === 'mcm' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-indigo)" />
              <span>Matrix Dimensions</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.matrices.map((m, idx) => (
                <div key={idx} style={{ padding: '0.65rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', color: 'var(--accent-indigo)' }}>{m.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{m.dim}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Grid size={18} color="var(--accent-purple)" />
              <span>DP Cost Table m[i][j]</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              {currentStep.table.map((row, rIdx) => 
                row.map((val, cIdx) => (
                  <div key={`${rIdx}-${cIdx}`} style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    background: val === '-' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid var(--border-color)',
                    color: val === '-' ? 'var(--text-dim)' : 'var(--accent-purple)',
                    fontWeight: '700',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {data.type === 'lcs' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Longest Common Subsequence State</h4>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>String 1: </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{data.s1}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>String 2: </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-purple)' }}>{data.s2}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LCS Subsequence Found: </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
                "{currentStep.lcsSoFar}"
              </span>
            </div>
          </div>
        </div>
      )}

      {data.type === 'knapsack' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Item List</h4>
            {data.items.map(item => (
              <div key={item.id} style={{ padding: '0.65rem', marginBottom: '0.5rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>Item {item.id}</span>
                <span style={{ color: 'var(--accent-emerald)' }}>${item.val}</span>
                <span style={{ color: 'var(--accent-amber)' }}>{item.wt} kg</span>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={40} color="var(--accent-emerald)" />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accumulated DP Max Value</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              ${currentStep.maxProfit}
            </div>
          </div>
        </div>
      )}

      {data.type === 'floyd' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Grid size={18} color="var(--accent-cyan)" />
            <span>All-Pairs Distance Matrix (k = {currentStep.k})</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            {currentStep.matrix.map((row, rIdx) =>
              row.map((val, cIdx) => (
                <div key={`${rIdx}-${cIdx}`} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: val === 'INF' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid var(--border-color)',
                  color: val === 'INF' ? 'var(--text-dim)' : 'var(--accent-cyan)',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {val}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {data.type === 'bellman' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--accent-emerald)" />
            <span>Shortest Distance Array dist[] (Step {currentStep.step} / 4)</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem', textAlign: 'center' }}>
            {currentStep.dist.map((val, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Node {idx}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
