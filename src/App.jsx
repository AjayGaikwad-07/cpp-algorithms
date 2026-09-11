import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TheoryTab from './components/TheoryTab';
import CompilerTab from './components/CompilerTab';
import SortingVisualizer from './components/Visualizers/SortingVisualizer';
import GraphVisualizer from './components/Visualizers/GraphVisualizer';
import GreedyVisualizer from './components/Visualizers/GreedyVisualizer';
import DynamicProgrammingVisualizer from './components/Visualizers/DynamicProgrammingVisualizer';
import { ALGORITHMS } from './data/algorithmsData';
import { BookOpen, Activity, Terminal } from 'lucide-react';

export default function App() {
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS[0]);
  const [activeTab, setActiveTab] = useState('visualizer'); // 'theory' | 'visualizer' | 'compiler'
  const [searchTerm, setSearchTerm] = useState('');

  const renderVisualizerComponent = () => {
    if (selectedAlgo.category === 'sorting') {
      return <SortingVisualizer algo={selectedAlgo} />;
    } else if (selectedAlgo.category === 'graph') {
      return <GraphVisualizer algo={selectedAlgo} />;
    } else if (selectedAlgo.category === 'greedy') {
      return <GreedyVisualizer algo={selectedAlgo} />;
    } else if (selectedAlgo.category === 'dp') {
      return <DynamicProgrammingVisualizer algo={selectedAlgo} />;
    }
    return null;
  };

  return (
    <div className="app-container">
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />

      <div className="main-content">
        <Sidebar 
          algorithms={ALGORITHMS}
          selectedAlgo={selectedAlgo}
          setSelectedAlgo={setSelectedAlgo}
          searchTerm={searchTerm}
        />

        <main className="workspace-area">
          {/* Top Bar with Algorithm Title & Workspace Tabs */}
          <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', color: 'var(--accent-indigo)' }}>
                {selectedAlgo.categoryName}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff' }}>
                {selectedAlgo.name}
              </h2>
            </div>

            {/* Tab Switcher */}
            <div className="tab-group">
              <button 
                className={`tab-btn ${activeTab === 'theory' ? 'active' : ''}`}
                onClick={() => setActiveTab('theory')}
              >
                <BookOpen size={16} />
                <span>Theory & Notes</span>
              </button>

              <button 
                className={`tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
                onClick={() => setActiveTab('visualizer')}
              >
                <Activity size={16} />
                <span>Interactive Visualizer</span>
              </button>

              <button 
                className={`tab-btn ${activeTab === 'compiler' ? 'active' : ''}`}
                onClick={() => setActiveTab('compiler')}
              >
                <Terminal size={16} />
                <span>C++ Compiler</span>
              </button>
            </div>
          </div>

          {/* Active Workspace View */}
          <div style={{ flex: 1 }}>
            {activeTab === 'theory' && <TheoryTab algo={selectedAlgo} />}
            {activeTab === 'visualizer' && renderVisualizerComponent()}
            {activeTab === 'compiler' && <CompilerTab algo={selectedAlgo} />}
          </div>
        </main>
      </div>
    </div>
  );
}
