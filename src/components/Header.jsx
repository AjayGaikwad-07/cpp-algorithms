import React from 'react';
import { Code2, Github, Terminal, Sparkles, BookOpen } from 'lucide-react';

export default function Header({ activeCategory, setActiveCategory, searchTerm, setSearchTerm }) {
  return (
    <header className="glass-card" style={{
      borderRadius: '0 0 16px 16px',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 20,
      margin: '0 0 1rem 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
          padding: '0.6rem',
          borderRadius: '10px',
          display: 'flex',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Code2 size={24} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            C++ Algorithms Hub
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Interactive Theory, Visualizer & Live C++ Compiler
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search algorithms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            outline: 'none',
            width: '200px'
          }}
        />

        <a 
          href="https://github.com/AjayGaikwad-07/cpp-algorithms" 
          target="_blank" 
          rel="noreferrer"
          className="btn-secondary"
          style={{ textDecoration: 'none' }}
        >
          <Github size={18} />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
