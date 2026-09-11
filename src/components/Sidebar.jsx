import React from 'react';
import { Network, Zap, Cpu, BarChart2, ChevronRight } from 'lucide-react';

export default function Sidebar({ algorithms, selectedAlgo, setSelectedAlgo, searchTerm }) {
  const categories = [
    { key: 'graph', name: 'Graph Algorithms', icon: Network, badgeClass: 'badge-graph' },
    { key: 'greedy', name: 'Greedy Algorithms', icon: Zap, badgeClass: 'badge-greedy' },
    { key: 'dp', name: 'Dynamic Programming', icon: Cpu, badgeClass: 'badge-dp' },
    { key: 'sorting', name: 'Sorting Algorithms', icon: BarChart2, badgeClass: 'badge-sorting' }
  ];

  const filteredAlgos = algorithms.filter(algo => 
    algo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    algo.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="glass-card" style={{
      width: '280px',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '1.25rem',
      overflowY: 'auto',
      flexShrink: 0
    }}>
      {categories.map(cat => {
        const catAlgos = filteredAlgos.filter(a => a.category === cat.key);
        if (catAlgos.length === 0) return null;
        const IconComponent = cat.icon;

        return (
          <div key={cat.key}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.65rem',
              paddingLeft: '0.5rem'
            }}>
              <IconComponent size={16} />
              <span>{cat.name}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {catAlgos.map(algo => {
                const isSelected = selectedAlgo.id === algo.id;
                return (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgo(algo)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid transparent',
                      background: isSelected 
                        ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.15))' 
                        : 'transparent',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? '600' : '400',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{algo.name}</span>
                    {isSelected && <ChevronRight size={14} color="var(--accent-indigo)" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </aside>
  );
}
