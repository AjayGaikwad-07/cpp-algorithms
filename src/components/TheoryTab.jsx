import React from 'react';
import { Clock, HardDrive, CheckCircle2, Globe, FileCode2, Layers } from 'lucide-react';

export default function TheoryTab({ algo }) {
  const getBadgeClass = (category) => {
    if (category === 'graph') return 'badge-graph';
    if (category === 'greedy') return 'badge-greedy';
    return 'badge-sorting';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className={`badge ${getBadgeClass(algo.category)}`}>
            {algo.categoryName}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            {algo.filePath}
          </span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
          {algo.name}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
          {algo.description}
        </p>
      </div>

      {/* Complexity Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-indigo)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>
              Time Complexity
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {algo.timeComplexity}
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.75rem', borderRadius: '10px', color: 'var(--accent-purple)' }}>
            <HardDrive size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '600' }}>
              Space Complexity
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {algo.spaceComplexity}
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Steps & Pseudocode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Step-by-Step Breakdown */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
            <Layers size={18} color="var(--accent-emerald)" />
            <span>Algorithm Step-by-Step</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {algo.steps.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.15)', 
                  color: 'var(--accent-emerald)', 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pseudocode Block */}
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
            <FileCode2 size={18} color="var(--accent-amber)" />
            <span>High-Level Pseudocode</span>
          </div>

          <pre style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            color: '#e2e8f0',
            overflowX: 'auto',
            lineHeight: '1.6'
          }}>
            {algo.pseudocode.join('\n')}
          </pre>
        </div>
      </div>

      {/* Real World Applications */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
          <Globe size={18} color="var(--accent-cyan)" />
          <span>Real-World Applications</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {algo.realWorld.map((app, i) => (
            <div key={i} style={{
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: 'var(--accent-cyan)',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <CheckCircle2 size={14} />
              <span>{app}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Test Case Section */}
      {algo.defaultInput && (
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
            <FileCode2 size={18} color="var(--accent-purple)" />
            <span>Sample Test Case Input</span>
          </div>

          <pre style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid var(--border-color)',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--accent-purple)',
            overflowX: 'auto',
            lineHeight: '1.5'
          }}>
            {algo.defaultInput}
          </pre>
        </div>
      )}
    </div>
  );
}
