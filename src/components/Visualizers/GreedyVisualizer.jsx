import React, { useState } from 'react';
import { Play, RotateCcw, Package, Clock, DollarSign } from 'lucide-react';

export default function GreedyVisualizer({ algo }) {
  const [stepIndex, setStepIndex] = useState(0);

  // Sample Fractional Knapsack items sorted by ratio
  const items = [
    { id: 1, val: 60, wt: 10, ratio: 6.0, taken: '100% (10 kg)', profit: 60 },
    { id: 2, val: 100, wt: 20, ratio: 5.0, taken: '100% (20 kg)', profit: 100 },
    { id: 3, val: 120, wt: 30, ratio: 4.0, taken: '66.7% (20 kg)', profit: 80 }
  ];

  const steps = [
    { capacity: 50, currentProfit: 0, activeItem: null, desc: 'Initial Knapsack Capacity = 50 kg. Items sorted by Value/Weight Ratio.' },
    { capacity: 40, currentProfit: 60, activeItem: 1, desc: 'Picked Item 1 (Ratio 6.0): Took 10 kg -> Capacity left = 40 kg, Profit = $60' },
    { capacity: 20, currentProfit: 160, activeItem: 2, desc: 'Picked Item 2 (Ratio 5.0): Took 20 kg -> Capacity left = 20 kg, Profit = $160' },
    { capacity: 0, currentProfit: 240, activeItem: 3, desc: 'Picked Item 3 (Ratio 4.0): Took fraction (20/30 kg = 66.7%) -> Capacity left = 0 kg, Total Max Profit = $240' }
  ];

  const currentStep = steps[stepIndex];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Controls Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={() => setStepIndex(prev => Math.min(prev + 1, steps.length - 1))} disabled={stepIndex >= steps.length - 1}>
            <Play size={16} />
            <span>Next Greedy Step ({stepIndex + 1}/{steps.length})</span>
          </button>
          <button className="btn-secondary" onClick={() => setStepIndex(0)}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        <div style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: '600' }}>
          {currentStep.desc}
        </div>
      </div>

      {/* Interactive Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Package size={28} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Remaining Capacity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
              {currentStep.capacity} kg
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <DollarSign size={28} color="var(--accent-emerald)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Accumulated Profit</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              ${currentStep.currentProfit}
            </div>
          </div>
        </div>
      </div>

      {/* Items Ratio & Pick Table */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ color: '#fff', marginBottom: '0.85rem' }}>Items Ratio & Allocation Table</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem' }}>Item ID</th>
              <th style={{ padding: '0.5rem' }}>Value ($)</th>
              <th style={{ padding: '0.5rem' }}>Weight (kg)</th>
              <th style={{ padding: '0.5rem' }}>Ratio (Val/Wt)</th>
              <th style={{ padding: '0.5rem' }}>Fraction Taken</th>
              <th style={{ padding: '0.5rem' }}>Profit Added</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const isActive = currentStep.activeItem === item.id;
              const isTaken = currentStep.activeItem >= item.id;

              return (
                <tr key={item.id} style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent'
                }}>
                  <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>Item {item.id}</td>
                  <td style={{ padding: '0.65rem' }}>${item.val}</td>
                  <td style={{ padding: '0.65rem' }}>{item.wt} kg</td>
                  <td style={{ padding: '0.65rem', fontWeight: '700', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                    {item.ratio.toFixed(1)}
                  </td>
                  <td style={{ padding: '0.65rem', color: isTaken ? 'var(--accent-emerald)' : 'var(--text-dim)' }}>
                    {isTaken ? item.taken : '0%'}
                  </td>
                  <td style={{ padding: '0.65rem', fontWeight: '700', color: isTaken ? 'var(--accent-emerald)' : 'var(--text-dim)' }}>
                    {isTaken ? `+$${item.profit}` : '$0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
