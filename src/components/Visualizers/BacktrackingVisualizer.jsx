import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Crown, Palette, Route, TrendingDown, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';

export default function BacktrackingVisualizer({ algo }) {
  // Determine active sub-problem based on selected algo
  const [activeSubAlgo, setActiveSubAlgo] = useState(
    algo?.id === 'graph_coloring' ? 'coloring' :
    algo?.id === 'hamiltonian_cycle' ? 'hamiltonian' :
    algo?.id === 'tsp_backtracking' ? 'tsp' : 'nqueens'
  );

  useEffect(() => {
    if (algo?.id === 'graph_coloring') setActiveSubAlgo('coloring');
    else if (algo?.id === 'hamiltonian_cycle') setActiveSubAlgo('hamiltonian');
    else if (algo?.id === 'tsp_backtracking') setActiveSubAlgo('tsp');
    else if (algo?.id === 'n_queens') setActiveSubAlgo('nqueens');
  }, [algo]);

  // N-Queens State
  const [nSize, setNSize] = useState(4);
  const [nQueensStepIdx, setNQueensStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  // Generate N-Queens Step-by-Step Trajectory
  const generateNQueensSteps = (n) => {
    const steps = [];
    const board = new Array(n).fill(-1);
    let totalSols = 0;
    let statesExplored = 0;

    steps.push({
      board: [...board],
      currentRow: 0,
      currentCol: 0,
      conflictRow: -1,
      conflictCol: -1,
      type: 'init',
      desc: `Initialized empty ${n}x${n} chessboard. Ready to place ${n} non-attacking queens.`,
      solutions: 0,
      states: 0
    });

    const isSafe = (b, row, col) => {
      for (let prevR = 0; prevR < row; prevR++) {
        const prevC = b[prevR];
        if (prevC === col || Math.abs(prevR - row) === Math.abs(prevC - col)) {
          return { safe: false, conflictR: prevR, conflictC: prevC };
        }
      }
      return { safe: true };
    };

    const solve = (row) => {
      statesExplored++;
      if (row === n) {
        totalSols++;
        steps.push({
          board: [...board],
          currentRow: n - 1,
          currentCol: board[n - 1],
          type: 'solution',
          desc: `🎉 Solution #${totalSols} found! All ${n} queens placed with zero conflicts.`,
          solutions: totalSols,
          states: statesExplored
        });
        return;
      }

      for (let col = 0; col < n; col++) {
        const { safe, conflictR, conflictC } = isSafe(board, row, col);

        if (safe) {
          board[row] = col;
          steps.push({
            board: [...board],
            currentRow: row,
            currentCol: col,
            type: 'place',
            desc: `Row ${row}: Safely placed Queen at Column ${col}. Advancing to Row ${row + 1}.`,
            solutions: totalSols,
            states: statesExplored
          });

          solve(row + 1);

          board[row] = -1; // Backtrack
          steps.push({
            board: [...board],
            currentRow: row,
            currentCol: col,
            type: 'backtrack',
            desc: `Backtracking from Row ${row + 1} to Row ${row}: Removing Queen from Col ${col} to try next column.`,
            solutions: totalSols,
            states: statesExplored
          });
        } else {
          steps.push({
            board: [...board],
            currentRow: row,
            currentCol: col,
            conflictRow: conflictR,
            conflictCol: conflictC,
            type: 'conflict',
            desc: `Conflict at (Row ${row}, Col ${col}): Threatened by Queen at (Row ${conflictR}, Col ${conflictC}). Pruning branch!`,
            solutions: totalSols,
            states: statesExplored
          });
        }
      }
    };

    solve(0);

    steps.push({
      board: [...board],
      currentRow: -1,
      currentCol: -1,
      type: 'complete',
      desc: `State-Space Tree exploration completed! Explored ${statesExplored} states. Found ${totalSols} total solution(s).`,
      solutions: totalSols,
      states: statesExplored
    });

    return steps;
  };

  const nQueensSteps = generateNQueensSteps(nSize);
  const currentNQStep = nQueensSteps[Math.min(nQueensStepIdx, nQueensSteps.length - 1)] || nQueensSteps[0];

  // Auto-play effect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setNQueensStepIdx(prev => {
          if (prev < nQueensSteps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, nQueensSteps.length, speed]);

  // Graph Coloring Presets
  const graphColors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'];
  const graphColorNames = ['Red', 'Green', 'Blue', 'Yellow'];
  const [coloredNodes, setColoredNodes] = useState([1, 2, 1, 3, 2]);

  // Hamiltonian & TSP Presets
  const tspCities = [
    { id: 0, name: 'City A', x: 60, y: 50 },
    { id: 1, name: 'City B', x: 220, y: 40 },
    { id: 2, name: 'City C', x: 260, y: 180 },
    { id: 3, name: 'City D', x: 80, y: 190 }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Sub-Algorithm Navigation Tabs */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Backtracking Domain:
          </span>
          <div className="tab-group" style={{ margin: 0 }}>
            <button className={`tab-btn ${activeSubAlgo === 'nqueens' ? 'active' : ''}`} onClick={() => { setActiveSubAlgo('nqueens'); setNQueensStepIdx(0); setIsPlaying(false); }}>
              <Crown size={15} />
              <span>N-Queens</span>
            </button>
            <button className={`tab-btn ${activeSubAlgo === 'coloring' ? 'active' : ''}`} onClick={() => { setActiveSubAlgo('coloring'); setIsPlaying(false); }}>
              <Palette size={15} />
              <span>Graph Coloring</span>
            </button>
            <button className={`tab-btn ${activeSubAlgo === 'hamiltonian' ? 'active' : ''}`} onClick={() => { setActiveSubAlgo('hamiltonian'); setIsPlaying(false); }}>
              <Route size={15} />
              <span>Hamiltonian Cycle</span>
            </button>
            <button className={`tab-btn ${activeSubAlgo === 'tsp' ? 'active' : ''}`} onClick={() => { setActiveSubAlgo('tsp'); setIsPlaying(false); }}>
              <TrendingDown size={15} />
              <span>Exact TSP</span>
            </button>
          </div>
        </div>

        {/* N-Queens Board Size Selector */}
        {activeSubAlgo === 'nqueens' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>Board Size (N):</span>
            {[4, 5, 6, 8].map(size => (
              <button
                key={size}
                className={nSize === size ? 'btn-primary' : 'btn-secondary'}
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                onClick={() => { setNSize(size); setNQueensStepIdx(0); setIsPlaying(false); }}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ----------------- N-QUEENS INTERACTIVE VIEW ----------------- */}
      {activeSubAlgo === 'nqueens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Playback Controls */}
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => setNQueensStepIdx(prev => Math.max(0, prev - 1))} disabled={nQueensStepIdx === 0 || isPlaying}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause' : 'Auto Step'}</span>
              </button>
              <button className="btn-secondary" onClick={() => setNQueensStepIdx(prev => Math.min(nQueensSteps.length - 1, prev + 1))} disabled={nQueensStepIdx >= nQueensSteps.length - 1 || isPlaying}>
                <ChevronRight size={16} />
              </button>
              <button className="btn-secondary" onClick={() => { setNQueensStepIdx(0); setIsPlaying(false); }}>
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                Step {nQueensStepIdx + 1} / {nQueensSteps.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>Speed:</span>
              <input
                type="range"
                min="100"
                max="1200"
                step="100"
                value={1300 - speed}
                onChange={(e) => setSpeed(1300 - Number(e.target.value))}
                style={{ width: '100px', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Current Step Description Callout */}
          <div className="glass-card" style={{
            padding: '0.85rem 1.25rem',
            borderLeft: currentNQStep.type === 'solution' ? '4px solid var(--accent-emerald)' : currentNQStep.type === 'conflict' ? '4px solid var(--accent-rose)' : '4px solid var(--accent-indigo)',
            background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {currentNQStep.type === 'solution' ? <CheckCircle2 size={20} color="var(--accent-emerald)" /> : currentNQStep.type === 'conflict' ? <XCircle size={20} color="var(--accent-rose)" /> : <Info size={20} color="var(--accent-indigo)" />}
            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>
              {currentNQStep.desc}
            </span>
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>States Explored</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
                {currentNQStep.states}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Valid Solutions Found</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                {currentNQStep.solutions}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current Row / Depth</div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                Row {currentNQStep.currentRow >= 0 ? currentNQStep.currentRow : 'Done'}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Time Complexity</div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                O(N!)
              </div>
            </div>
          </div>

          {/* Chessboard Canvas */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${nSize}, minmax(44px, 60px))`,
              gridTemplateRows: `repeat(${nSize}, minmax(44px, 60px))`,
              gap: '4px',
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
              {Array.from({ length: nSize }).map((_, r) => (
                Array.from({ length: nSize }).map((_, c) => {
                  const isDark = (r + c) % 2 === 1;
                  const hasQueen = currentNQStep.board[r] === c;
                  const isTesting = currentNQStep.currentRow === r && currentNQStep.currentCol === c;
                  const isConflictSquare = currentNQStep.type === 'conflict' && (
                    (r === currentNQStep.currentRow && c === currentNQStep.currentCol) ||
                    (r === currentNQStep.conflictRow && c === currentNQStep.conflictCol)
                  );

                  let bg = isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(51, 65, 85, 0.65)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';

                  if (hasQueen) {
                    bg = 'rgba(16, 185, 129, 0.35)';
                    border = '2px solid var(--accent-emerald)';
                  }
                  if (isTesting && !hasQueen) {
                    bg = isConflictSquare ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.35)';
                    border = isConflictSquare ? '2px solid var(--accent-rose)' : '2px solid var(--accent-indigo)';
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: bg,
                        border: border,
                        borderRadius: '6px',
                        fontSize: nSize > 6 ? '1.25rem' : '1.75rem',
                        transition: 'all 0.15s ease',
                        cursor: 'default'
                      }}
                    >
                      {hasQueen && (
                        <span style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }}>👑</span>
                      )}
                      {!hasQueen && isTesting && (
                        <span style={{ opacity: 0.6, fontSize: '1.1rem' }}>
                          {isConflictSquare ? '❌' : '❓'}
                        </span>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>
              👑 Green Square = Placed Queen | ❌ Red = Attack Conflict / Pruned Branch | ❓ Indigo = Candidate Check
            </div>
          </div>
        </div>
      )}

      {/* ----------------- GRAPH COLORING INTERACTIVE VIEW ----------------- */}
      {activeSubAlgo === 'coloring' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="var(--accent-purple)" />
              <span>Graph m-Coloring Problem (m = 3 Colors)</span>
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
              Valid 3-Coloring State
            </span>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Assigns colors to vertices such that no two adjacent vertices connected by an edge share the same color. Backtracking tries colors $1 \dots m$ and recurses to the next vertex, backtracking when no safe color is available.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px' }}>
            <svg width="340" height="220" viewBox="0 0 340 220">
              {/* Edges */}
              <line x1="170" y1="40" x2="80" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="170" y1="40" x2="260" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="80" y1="100" x2="120" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="260" y1="100" x2="220" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="120" y1="180" x2="220" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <line x1="80" y1="100" x2="260" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

              {/* Vertices */}
              {[
                { id: 0, x: 170, y: 40, label: 'V0' },
                { id: 1, x: 80, y: 100, label: 'V1' },
                { id: 2, x: 260, y: 100, label: 'V2' },
                { id: 3, x: 120, y: 180, label: 'V3' },
                { id: 4, x: 220, y: 180, label: 'V4' }
              ].map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={graphColors[coloredNodes[node.id] - 1] || '#334155'}
                    stroke="#fff"
                    strokeWidth="2"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
                  />
                  <text x={node.x} y={node.y + 5} fill="#fff" fontSize="12" fontWeight="700" textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {coloredNodes.map((colorIdx, vIdx) => (
              <div key={vIdx} className="glass-card" style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: graphColors[colorIdx - 1] }} />
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600' }}>
                  Vertex {vIdx}: {graphColorNames[colorIdx - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- HAMILTONIAN & TSP VIEW ----------------- */}
      {(activeSubAlgo === 'hamiltonian' || activeSubAlgo === 'tsp') && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {activeSubAlgo === 'tsp' ? <TrendingDown size={18} color="var(--accent-emerald)" /> : <Route size={18} color="var(--accent-indigo)" />}
              <span>{activeSubAlgo === 'tsp' ? 'Exact TSP Tour (Branch & Bound Backtracking)' : 'Hamiltonian Cycle (Visit Each Vertex Exactly Once)'}</span>
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
              {activeSubAlgo === 'tsp' ? 'Optimal Tour Cost: 35' : 'Valid Cycle: 0 -> 1 -> 2 -> 3 -> 0'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px' }}>
            <svg width="340" height="240" viewBox="0 0 340 240">
              {/* Tour Edges */}
              <line x1="60" y1="50" x2="220" y2="40" stroke="var(--accent-indigo)" strokeWidth="3" />
              <line x1="220" y1="40" x2="260" y2="180" stroke="var(--accent-indigo)" strokeWidth="3" />
              <line x1="260" y1="180" x2="80" y2="190" stroke="var(--accent-indigo)" strokeWidth="3" />
              <line x1="80" y1="190" x2="60" y2="50" stroke="var(--accent-indigo)" strokeWidth="3" />

              {/* Diagonal Edges */}
              <line x1="60" y1="50" x2="260" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4" />
              <line x1="220" y1="40" x2="80" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4" />

              {/* Edge weights */}
              <text x="140" y="35" fill="var(--accent-amber)" fontSize="11" fontWeight="700">10</text>
              <text x="250" y="110" fill="var(--accent-amber)" fontSize="11" fontWeight="700">15</text>
              <text x="170" y="205" fill="var(--accent-amber)" fontSize="11" fontWeight="700">20</text>
              <text x="55" y="125" fill="var(--accent-amber)" fontSize="11" fontWeight="700">25</text>

              {/* City Nodes */}
              {tspCities.map(city => (
                <g key={city.id}>
                  <circle cx={city.x} cy={city.y} r="22" fill="var(--bg-dark)" stroke="var(--accent-indigo)" strokeWidth="2.5" />
                  <text x={city.x} y={city.y + 4} fill="#fff" fontSize="11" fontWeight="700" textAnchor="middle">
                    {city.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="glass-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(99, 102, 241, 0.1)' }}>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600' }}>
              Optimal Sequence: City A (0) ➔ City B (1) ➔ City C (2) ➔ City D (3) ➔ City A (0)
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
              Total Cost = 10 + 15 + 20 + 25 = 70
            </span>
          </div>
        </div>
      )}

      {/* Comparative Complexity Summary Card */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>
          📊 Backtracking Combinatorial Problems Summary
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Problem</th>
                <th style={{ padding: '0.5rem' }}>Decision Space</th>
                <th style={{ padding: '0.5rem' }}>Constraint (Bounding)</th>
                <th style={{ padding: '0.5rem' }}>Time Complexity</th>
                <th style={{ padding: '0.5rem' }}>Space Complexity</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>N-Queens</td>
                <td style={{ padding: '0.65rem' }}>Place Queen in row $i$, column $j$</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)' }}>No same column or diagonal attack</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>O(N!)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>O(N)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>Graph m-Coloring</td>
                <td style={{ padding: '0.65rem' }}>Assign color $c \in [1 \dots m]$ to vertex $v$</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)' }}>No adjacent vertices share same color</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>O(m^V)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>O(V)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>Hamiltonian Path/Cycle</td>
                <td style={{ padding: '0.65rem' }}>Select next unvisited adjacent vertex</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)' }}>Edge exists & vertex not already in path</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>O(V!)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>O(V)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>Travelling Salesperson (TSP)</td>
                <td style={{ padding: '0.65rem' }}>Permutation of cities forming closed tour</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)' }}>Branch & Bound: prune if currentCost $\ge$ minCost</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>O(V!)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>O(V)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
