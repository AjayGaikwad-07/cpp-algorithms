import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  Package, 
  DollarSign, 
  MapPin, 
  Layers, 
  Compass, 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Info
} from 'lucide-react';

export default function BranchAndBoundVisualizer({ algo }) {
  const isKnapsack = !algo || algo.id === 'knapsack_branch_and_bound';

  // ==========================================
  // 0/1 KNAPSACK BRANCH AND BOUND DATA & STEPS
  // ==========================================
  const knapsackItems = [
    { id: 1, val: 40, wt: 2, ratio: 20.0 },
    { id: 2, val: 30, wt: 5, ratio: 6.0 },
    { id: 3, val: 50, wt: 10, ratio: 5.0 },
    { id: 4, val: 10, wt: 5, ratio: 2.0 }
  ];
  const knapsackCapacity = 16;

  const knapsackSteps = [
    {
      id: 0,
      title: 'Initialize Root (Dummy State)',
      activeNodeId: 'root',
      currentProfit: 0,
      currentWeight: 0,
      maxProfit: 0,
      bound: 115.0,
      bestItems: [],
      prunedCount: 0,
      pq: [{ id: 'root', label: 'Root (Lv -1)', wt: 0, val: 0, bound: 115.0 }],
      comment: 'Root node created: Weight = 0 kg, Profit = $0. Optimistic Upper Bound calculated via Fractional Knapsack = $115.00. Inserted into Max-Heap.',
      action: 'enqueue',
      nodes: [
        { id: 'root', label: 'Root', level: -1, val: 0, wt: 0, bound: 115, status: 'active', desc: 'Starting Node' }
      ]
    },
    {
      id: 1,
      title: 'Branch on Item 1 (val: 40, wt: 2)',
      activeNodeId: 'node_1_in',
      currentProfit: 40,
      currentWeight: 2,
      maxProfit: 40,
      bound: 115.0,
      bestItems: [1],
      prunedCount: 0,
      pq: [
        { id: 'node_1_in', label: 'Take Item 1', wt: 2, val: 40, bound: 115.0 },
        { id: 'node_1_ex', label: 'Skip Item 1', wt: 0, val: 0, bound: 82.0 }
      ],
      comment: 'Branch left (Take Item 1): Weight 2 <= 16, Profit $40 > Best $0 -> New Best = $40. Bound = $115. Branch right (Skip Item 1): Bound = $82. Both enqueued.',
      action: 'branch',
      nodes: [
        { id: 'root', label: 'Root', level: -1, val: 0, wt: 0, bound: 115, status: 'visited' },
        { id: 'node_1_in', label: '+Item 1', level: 0, val: 40, wt: 2, bound: 115, status: 'active', desc: 'Feasible (Best: $40)' },
        { id: 'node_1_ex', label: '-Item 1', level: 0, val: 0, wt: 0, bound: 82, status: 'queued', desc: 'Upper Bound = $82' }
      ]
    },
    {
      id: 2,
      title: 'Explore +Item 1 -> Branch on Item 2 (val: 30, wt: 5)',
      activeNodeId: 'node_2_in',
      currentProfit: 70,
      currentWeight: 7,
      maxProfit: 70,
      bound: 115.0,
      bestItems: [1, 2],
      prunedCount: 0,
      pq: [
        { id: 'node_2_in', label: '+Item 1, +Item 2', wt: 7, val: 70, bound: 115.0 },
        { id: 'node_2_ex', label: '+Item 1, -Item 2', wt: 2, val: 40, bound: 98.0 },
        { id: 'node_1_ex', label: 'Skip Item 1', wt: 0, val: 0, bound: 82.0 }
      ],
      comment: 'Pop Node (+Item 1). Branch left (+Item 2): Weight = 7 <= 16, Profit = $70 -> New Best = $70! Bound = $115. Branch right (-Item 2): Bound = $98. Both enqueued.',
      action: 'branch',
      nodes: [
        { id: 'root', label: 'Root', level: -1, val: 0, wt: 0, bound: 115, status: 'visited' },
        { id: 'node_1_in', label: '+Item 1', level: 0, val: 40, wt: 2, bound: 115, status: 'visited' },
        { id: 'node_1_ex', label: '-Item 1', level: 0, val: 0, wt: 0, bound: 82, status: 'queued' },
        { id: 'node_2_in', label: '+Item 2', level: 1, val: 70, wt: 7, bound: 115, status: 'active', desc: 'Feasible (Best: $70)' },
        { id: 'node_2_ex', label: '-Item 2', level: 1, val: 40, wt: 2, bound: 98, status: 'queued', desc: 'Upper Bound = $98' }
      ]
    },
    {
      id: 3,
      title: 'Explore (+Item 1, +Item 2) -> Branch on Item 3 (val: 50, wt: 10)',
      activeNodeId: 'node_3_in',
      currentProfit: 70,
      currentWeight: 7,
      maxProfit: 70,
      bound: 115.0,
      bestItems: [1, 2],
      prunedCount: 1,
      pq: [
        { id: 'node_2_ex', label: '+Item 1, -Item 2', wt: 2, val: 40, bound: 98.0 },
        { id: 'node_1_ex', label: 'Skip Item 1', wt: 0, val: 0, bound: 82.0 },
        { id: 'node_3_ex', label: '+It1, +It2, -It3', wt: 7, val: 70, bound: 80.0 }
      ],
      comment: 'Try +Item 3: Weight = 7 + 10 = 17 > Capacity 16! PRUNED (Capacity Infeasible ❌). Try -Item 3: Weight = 7, Profit = $70, Bound = $80. Enqueued.',
      action: 'prune',
      nodes: [
        { id: 'root', label: 'Root', level: -1, val: 0, wt: 0, bound: 115, status: 'visited' },
        { id: 'node_1_in', label: '+Item 1', level: 0, val: 40, wt: 2, bound: 115, status: 'visited' },
        { id: 'node_1_ex', label: '-Item 1', level: 0, val: 0, wt: 0, bound: 82, status: 'queued' },
        { id: 'node_2_in', label: '+Item 2', level: 1, val: 70, wt: 7, bound: 115, status: 'visited' },
        { id: 'node_2_ex', label: '-Item 2', level: 1, val: 40, wt: 2, bound: 98, status: 'queued' },
        { id: 'node_3_in', label: '+Item 3', level: 2, val: 120, wt: 17, bound: 0, status: 'pruned', desc: '❌ Weight 17 > 16 Pruned' },
        { id: 'node_3_ex', label: '-Item 3', level: 2, val: 70, wt: 7, bound: 80, status: 'queued', desc: 'Bound = $80' }
      ]
    },
    {
      id: 4,
      title: 'Explore (+Item 1, -Item 2, Bound: $98) -> Branch on Item 3',
      activeNodeId: 'node_3_sub_in',
      currentProfit: 90,
      currentWeight: 12,
      maxProfit: 90,
      bound: 98.0,
      bestItems: [1, 3],
      prunedCount: 1,
      pq: [
        { id: 'node_3_sub_in', label: '+Item 1, -Item 2, +Item 3', wt: 12, val: 90, bound: 98.0 },
        { id: 'node_1_ex', label: 'Skip Item 1', wt: 0, val: 0, bound: 82.0 },
        { id: 'node_3_ex', label: '+It1, +It2, -It3', wt: 7, val: 70, bound: 80.0 },
        { id: 'node_3_sub_ex', label: '+Item 1, -Item 2, -Item 3', wt: 2, val: 40, bound: 50.0 }
      ],
      comment: 'Top of PQ has Bound $98: Branch left (+Item 3): Weight = 2 + 10 = 12 <= 16. Profit = $40 + $50 = $90! New Best Profit = $90 🏆! Bound = $98.',
      action: 'optimal_update',
      nodes: [
        { id: 'root', label: 'Root', level: -1, val: 0, wt: 0, bound: 115, status: 'visited' },
        { id: 'node_1_in', label: '+Item 1', level: 0, val: 40, wt: 2, bound: 115, status: 'visited' },
        { id: 'node_1_ex', label: '-Item 1', level: 0, val: 0, wt: 0, bound: 82, status: 'queued' },
        { id: 'node_2_in', label: '+Item 2', level: 1, val: 70, wt: 7, bound: 115, status: 'visited' },
        { id: 'node_2_ex', label: '-Item 2', level: 1, val: 40, wt: 2, bound: 98, status: 'visited' },
        { id: 'node_3_in', label: '+Item 3', level: 2, val: 120, wt: 17, bound: 0, status: 'pruned' },
        { id: 'node_3_ex', label: '-Item 3', level: 2, val: 70, wt: 7, bound: 80, status: 'queued' },
        { id: 'node_3_sub_in', label: '+Item 3', level: 2, val: 90, wt: 12, bound: 98, status: 'active', desc: '🏆 New Best $90' },
        { id: 'node_3_sub_ex', label: '-Item 3', level: 2, val: 40, wt: 2, bound: 50, status: 'pruned', desc: '❌ Bound $50 <= $90' }
      ]
    },
    {
      id: 5,
      title: 'Bounding Pruning Phase: Prune all Subtrees with Bound <= $90',
      activeNodeId: 'node_3_sub_in',
      currentProfit: 90,
      currentWeight: 12,
      maxProfit: 90,
      bound: 98.0,
      bestItems: [1, 3],
      prunedCount: 4,
      pq: [],
      comment: 'All remaining nodes in PQ have Upper Bound <= $90 (e.g. Bound $82, $80, $50). By Branch and Bound theorem, NO descendant can exceed $90! All remaining branches PRUNED!',
      action: 'complete',
      nodes: [
        { id: 'root', label: 'Root', level: -1, val: 0, wt: 0, bound: 115, status: 'visited' },
        { id: 'node_1_in', label: '+Item 1', level: 0, val: 40, wt: 2, bound: 115, status: 'visited' },
        { id: 'node_1_ex', label: '-Item 1', level: 0, val: 0, wt: 0, bound: 82, status: 'pruned', desc: '❌ Bound $82 <= $90' },
        { id: 'node_2_in', label: '+Item 2', level: 1, val: 70, wt: 7, bound: 115, status: 'visited' },
        { id: 'node_2_ex', label: '-Item 2', level: 1, val: 40, wt: 2, bound: 98, status: 'visited' },
        { id: 'node_3_in', label: '+Item 3', level: 2, val: 120, wt: 17, bound: 0, status: 'pruned' },
        { id: 'node_3_ex', label: '-Item 3', level: 2, val: 70, wt: 7, bound: 80, status: 'pruned', desc: '❌ Bound $80 <= $90' },
        { id: 'node_3_sub_in', label: '+Item 3', level: 2, val: 90, wt: 12, bound: 98, status: 'optimal', desc: '👑 Optimal Subset {1, 3}' },
        { id: 'node_3_sub_ex', label: '-Item 3', level: 2, val: 40, wt: 2, bound: 50, status: 'pruned' }
      ]
    }
  ];

  // ==========================================
  // TSP BRANCH AND BOUND DATA & STEPS
  // ==========================================
  const tspCities = [
    { id: 0, name: 'City 0 (Start)', x: 140, y: 80 },
    { id: 1, name: 'City 1', x: 380, y: 70 },
    { id: 2, name: 'City 2', x: 420, y: 240 },
    { id: 3, name: 'City 3', x: 110, y: 230 }
  ];

  const tspMatrix = [
    [Infinity, 10, 15, 20],
    [10, Infinity, 35, 25],
    [15, 35, Infinity, 30],
    [20, 25, 30, Infinity]
  ];

  const tspSteps = [
    {
      id: 0,
      title: 'Initial Cost Matrix Reduction (Root Lower Bound)',
      activeCity: 0,
      path: [0],
      currentTourCost: Infinity,
      lowerBound: 70,
      comment: 'Row reduction: Row 0 min=10, Row 1 min=10, Row 2 min=15, Row 3 min=20 (Sum = 55). Column reduction: Col 1 min=15 (Sum = 15). Root Lower Bound = 55 + 15 = 70.',
      status: 'root',
      pq: [{ city: 0, path: '0', cost: 70 }],
      prunedCount: 0
    },
    {
      id: 1,
      title: 'Branch from City 0 -> Cities {1, 2, 3}',
      activeCity: 3,
      path: [0, 3],
      currentTourCost: Infinity,
      lowerBound: 75,
      comment: 'Generated child branches: Move to City 1 (LB = 80), City 2 (LB = 80), City 3 (LB = 75). City 3 has lowest lower bound (75), prioritized at top of Min-Heap!',
      status: 'branch',
      pq: [
        { city: 3, path: '0 -> 3', cost: 75 },
        { city: 2, path: '0 -> 2', cost: 80 },
        { city: 1, path: '0 -> 1', cost: 80 }
      ],
      prunedCount: 0
    },
    {
      id: 2,
      title: 'Expand City 3 -> Move to City 2',
      activeCity: 2,
      path: [0, 3, 2],
      currentTourCost: Infinity,
      lowerBound: 80,
      comment: 'From City 3, branch to unvisited City 2: Lower bound = 80. Edge cost 30 reduces matrix, yielding child bound of 80.',
      status: 'branch',
      pq: [
        { city: 2, path: '0 -> 3 -> 2', cost: 80 },
        { city: 2, path: '0 -> 2', cost: 80 },
        { city: 1, path: '0 -> 1', cost: 80 }
      ],
      prunedCount: 0
    },
    {
      id: 3,
      title: 'Complete Tour 0 -> 2 -> 3 -> 1 -> 0 (Cost: 80)',
      activeCity: 1,
      path: [0, 2, 3, 1, 0],
      currentTourCost: 80,
      lowerBound: 80,
      comment: 'Complete valid Hamiltonian tour: 0 -> 2 -> 3 -> 1 -> 0. Exact cost = 15 + 30 + 25 + 10 = 80! Best Tour Cost updated to 80 🏆!',
      status: 'tour_found',
      pq: [
        { city: 1, path: '0 -> 3 (LB 95)', cost: 95 },
        { city: 2, path: '0 -> 1 (LB 95)', cost: 95 }
      ],
      prunedCount: 2
    },
    {
      id: 4,
      title: 'Lower Bound Pruning: Prune all paths with LB >= 80',
      activeCity: 0,
      path: [0, 2, 3, 1, 0],
      currentTourCost: 80,
      lowerBound: 80,
      comment: 'All alternate partial branches have Lower Bound >= 80 (cost 95). By Branch-and-Bound bounding principle, no further exploration is needed. 5 branches PRUNED!',
      status: 'optimal',
      pq: [],
      prunedCount: 5
    }
  ];

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = isKnapsack ? knapsackSteps : tspSteps;
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  // Auto playback effect
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
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  // Reset stepIndex if algorithm changes
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [algo?.id]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Header Card */}
      <div className="glass-card" style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(99, 102, 241, 0.08))',
        border: '1px solid rgba(14, 165, 233, 0.25)',
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
              background: 'rgba(14, 165, 233, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <Scissors size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                Branch & Bound Paradigm
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff' }}>
                {isKnapsack ? '0/1 Knapsack: Best-First Search & Upper Bound Pruning' : 'Travelling Salesperson: LCBB & Reduced Matrix Bounding'}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.8rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--accent-emerald)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: '600'
            }}>
              Pruning Strategy: {isKnapsack ? 'Upper Bound (Fractional Relax)' : 'Lower Bound (Reduced Matrix)'}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {isKnapsack 
            ? 'Branch-and-Bound tackles the NP-hard 0/1 Knapsack problem by expanding states in a binary decision tree. For each node, an optimistic Upper Bound is computed using Greedy Fractional Knapsack. Any subtree whose Upper Bound cannot exceed the best known profit is immediately PRUNED.' 
            : 'For the NP-hard Travelling Salesperson Problem, Least-Cost Branch and Bound (LCBB) calculates a Lower Bound using row & column matrix reduction. Paths whose lower bound equals or exceeds the best tour found so far are aggressively pruned without visiting.'}
        </p>
      </div>

      {/* Playback Controls & Status Banner */}
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
          <span style={{ color: 'var(--text-dim)' }}>Current Phase:</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
            {currentStep.title}
          </span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        {isKnapsack ? (
          <>
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Package size={30} color="var(--accent-amber)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Weight / Capacity</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.currentWeight} / {knapsackCapacity} kg
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <DollarSign size={30} color="var(--accent-emerald)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Best Known Profit</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  ${currentStep.maxProfit}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TrendingUp size={30} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Optimistic Bound</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  ${currentStep.bound.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Scissors size={30} color="var(--accent-rose)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Pruned Subtrees</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.prunedCount} Subtrees
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MapPin size={30} color="var(--accent-purple)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active City / Path</div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                  City {currentStep.activeCity} ({currentStep.path.join(' -> ')})
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TrendingDown size={30} color="var(--accent-emerald)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Best Tour Cost</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.currentTourCost === Infinity ? 'Searching...' : currentStep.currentTourCost}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Layers size={30} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Current Lower Bound</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.lowerBound}
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Scissors size={30} color="var(--accent-rose)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Branches Pruned</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.prunedCount} Subtrees
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Step Explanation Banner */}
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
          <strong style={{ color: '#fff', marginRight: '0.5rem' }}>Step {stepIndex + 1} Insight:</strong>
          {currentStep.comment}
        </div>
      </div>

      {/* Main Interactive Visualizer View */}
      {isKnapsack ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(280px, 1fr)', gap: '1.25rem' }}>
          {/* State-Space Tree Diagram */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700' }}>
                State-Space Tree & Pruning Map
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
                  Active Node
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-rose)' }}></span>
                  Pruned Subtree
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }}></span>
                  Optimal Solution
                </span>
              </div>
            </div>

            {/* Tree Nodes List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '420px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {currentStep.nodes.map(node => {
                const isOptimal = node.status === 'optimal';
                const isPruned = node.status === 'pruned';
                const isActive = node.status === 'active';

                let border = '1px solid var(--border-color)';
                let bg = 'rgba(15, 23, 42, 0.6)';
                let badgeColor = 'var(--text-muted)';
                let statusLabel = 'Explored';

                if (isOptimal) {
                  border = '1px solid var(--accent-emerald)';
                  bg = 'rgba(16, 185, 129, 0.15)';
                  badgeColor = 'var(--accent-emerald)';
                  statusLabel = 'Optimal Leaf';
                } else if (isPruned) {
                  border = '1px solid rgba(244, 63, 94, 0.4)';
                  bg = 'rgba(244, 63, 94, 0.1)';
                  badgeColor = 'var(--accent-rose)';
                  statusLabel = 'Pruned Branch';
                } else if (isActive) {
                  border = '1px solid var(--accent-cyan)';
                  bg = 'rgba(14, 165, 233, 0.15)';
                  badgeColor = 'var(--accent-cyan)';
                  statusLabel = 'Current Active';
                }

                return (
                  <div key={node.id} style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border,
                    background: bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.25s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {isOptimal ? (
                        <CheckCircle2 size={20} color="var(--accent-emerald)" />
                      ) : isPruned ? (
                        <XCircle size={20} color="var(--accent-rose)" />
                      ) : (
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: `2px solid ${badgeColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: '700',
                          color: badgeColor
                        }}>
                          {node.level >= 0 ? node.level + 1 : 'R'}
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
                            {node.label}
                          </span>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: badgeColor,
                            fontWeight: '600'
                          }}>
                            {statusLabel}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          {node.desc || (node.level === -1 ? 'Initial Root' : `Level ${node.level + 1} Decision`)}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      <div style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>
                        Val: ${node.val} | Wt: {node.wt} kg
                      </div>
                      <div style={{ color: isPruned ? 'var(--accent-rose)' : 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                        Bound: ${node.bound.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Priority Queue & Items Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Live Priority Queue (Max-Heap) */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>
                  Live Priority Queue (Max-Heap by Bound)
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {currentStep.pq.length} live nodes
                </span>
              </div>

              {currentStep.pq.length === 0 ? (
                <div style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  border: '1px dashed var(--border-color)',
                  borderRadius: '8px'
                }}>
                  Priority Queue Empty (All remaining branches bound-pruned or search terminated)
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {currentStep.pq.map((item, idx) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '6px',
                      background: idx === 0 ? 'rgba(14, 165, 233, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: idx === 0 ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: idx === 0 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                          color: idx === 0 ? '#0f172a' : '#fff',
                          fontWeight: '800',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>{item.label}</span>
                      </div>

                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                        Bound: ${item.bound.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Knapsack Items Ratio Table */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                Items Sorted by Value/Weight Ratio
              </h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0.45rem' }}>Item</th>
                    <th style={{ padding: '0.45rem' }}>Val ($)</th>
                    <th style={{ padding: '0.45rem' }}>Wt (kg)</th>
                    <th style={{ padding: '0.45rem' }}>Ratio</th>
                    <th style={{ padding: '0.45rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {knapsackItems.map(item => {
                    const isSelected = currentStep.bestItems.includes(item.id);
                    return (
                      <tr key={item.id} style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent'
                      }}>
                        <td style={{ padding: '0.45rem', fontWeight: '600', color: '#fff' }}>Item {item.id}</td>
                        <td style={{ padding: '0.45rem', color: 'var(--accent-emerald)' }}>${item.val}</td>
                        <td style={{ padding: '0.45rem', color: 'var(--accent-amber)' }}>{item.wt} kg</td>
                        <td style={{ padding: '0.45rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                          {item.ratio.toFixed(1)}
                        </td>
                        <td style={{ padding: '0.45rem' }}>
                          {isSelected ? (
                            <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>✓ In Optimal</span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)' }}>Excluded</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TSP Visualizer View */
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.3fr) minmax(280px, 1fr)', gap: '1.25rem' }}>
          {/* TSP Interactive Graph Tour Map */}
          <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700' }}>
                Travelling Salesperson Tour Graph (V = 4 Cities)
              </h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                Optimal Tour: 0 → 2 → 3 → 1 → 0
              </span>
            </div>

            <div style={{
              position: 'relative',
              width: '100%',
              height: '320px',
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden'
            }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Draw all pairwise edges */}
                {tspCities.map((c1, i) =>
                  tspCities.map((c2, j) => {
                    if (i >= j) return null;
                    const cost = tspMatrix[i][j];

                    // Check if edge is in current active path
                    let isPathEdge = false;
                    for (let p = 0; p < currentStep.path.length - 1; p++) {
                      if (
                        (currentStep.path[p] === i && currentStep.path[p + 1] === j) ||
                        (currentStep.path[p] === j && currentStep.path[p + 1] === i)
                      ) {
                        isPathEdge = true;
                      }
                    }

                    return (
                      <g key={`${i}-${j}`}>
                        <line 
                          x1={c1.x} 
                          y1={c1.y} 
                          x2={c2.x} 
                          y2={c2.y} 
                          stroke={isPathEdge ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.15)'}
                          strokeWidth={isPathEdge ? '3.5' : '1.5'}
                          strokeDasharray={isPathEdge ? 'none' : '4,4'}
                        />
                        <text
                          x={(c1.x + c2.x) / 2}
                          y={(c1.y + c2.y) / 2 - 4}
                          fill={isPathEdge ? 'var(--accent-emerald)' : 'var(--text-dim)'}
                          fontSize="11"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {cost}
                        </text>
                      </g>
                    );
                  })
                )}

                {/* Draw City Vertices */}
                {tspCities.map(city => {
                  const isActive = currentStep.activeCity === city.id;
                  const isVisited = currentStep.path.includes(city.id);

                  return (
                    <g key={city.id}>
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r={isActive ? 22 : 18}
                        fill={isActive ? 'var(--accent-purple)' : isVisited ? 'var(--accent-emerald)' : 'rgba(30, 41, 59, 0.9)'}
                        stroke={isActive ? '#fff' : isVisited ? 'var(--accent-emerald)' : 'rgba(255, 255, 255, 0.4)'}
                        strokeWidth="2.5"
                      />
                      <text
                        x={city.x}
                        y={city.y + 4}
                        fill="#fff"
                        fontSize="12"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {city.id}
                      </text>
                      <text
                        x={city.x}
                        y={city.y + (city.y > 150 ? 32 : -25)}
                        fill="var(--text-main)"
                        fontSize="11"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Column: Reduced Cost Matrix Inspector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>
                  Pairwise Distance Matrix (C[i][j])
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>∞ = Self Loop</span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.45rem' }}>From \ To</th>
                    {tspCities.map(c => <th key={c.id} style={{ padding: '0.45rem' }}>C{c.id}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tspMatrix.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.45rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>C{i}</td>
                      {row.map((val, j) => {
                        const isSelf = i === j;
                        return (
                          <td key={j} style={{
                            padding: '0.45rem',
                            fontFamily: 'var(--font-mono)',
                            color: isSelf ? 'var(--text-dim)' : '#fff',
                            fontWeight: isSelf ? '400' : '600'
                          }}>
                            {val === Infinity ? '∞' : val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bounding Math & Reduction Formula */}
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>
                Reduced Matrix Lower Bound Formula
              </h4>
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--accent-cyan)',
                lineHeight: '1.6'
              }}>
                <div>LB(root) = ∑ RowMin + ∑ ColMin</div>
                <div>LB(child) = LB(parent) + M[u][v] + ∑ reductions</div>
                <div style={{ color: 'var(--accent-rose)', marginTop: '4px' }}>
                  If LB(child) ≥ MinTourCost ⟹ PRUNE!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison: Brute-Force Backtracking vs Branch-and-Bound */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem' }}>
          Branch-and-Bound vs Backtracking & Dynamic Programming
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem' }}>Property</th>
                <th style={{ padding: '0.65rem' }}>Brute-Force / Backtracking</th>
                <th style={{ padding: '0.65rem' }}>Branch and Bound (LCBB)</th>
                <th style={{ padding: '0.65rem' }}>Dynamic Programming</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Search Strategy</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Depth-First Search (DFS) with backtracking</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>Best-First / Least-Cost (Priority Queue)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-amber)' }}>Bottom-up Table / Memoization</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Pruning Technique</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Only when constraint strictly violated</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>Upper/Lower Bound optimistic mathematical estimation</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Overlapping subproblem memoization</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Pruning Power</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)' }}>Weak (explores deep fruitless branches)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)' }}>Aggressive (cuts entire subtrees early)</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>N/A (solves subproblems once)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem', fontWeight: '600', color: '#fff' }}>Application Scope</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Combinatorial search & satisfaction (N-Queens, Sudoku)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)' }}>Combinatorial Optimization (0/1 Knapsack, TSP, Job Shop)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-amber)' }}>Optimal substructure problems</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
