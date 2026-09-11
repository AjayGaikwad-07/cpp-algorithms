import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Shuffle, FastForward, Activity } from 'lucide-react';

export default function SortingVisualizer({ algo }) {
  const [array, setArray] = useState([]);
  const [comparingIdxs, setComparingIdxs] = useState([]);
  const [swappingIdxs, setSwappingIdxs] = useState([]);
  const [sortedIdxs, setSortedIdxs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(250);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const animRef = useRef(null);
  const isSortingRef = useRef(false);

  // Generate random array
  const generateNewArray = () => {
    setIsPlaying(false);
    isSortingRef.current = false;
    if (animRef.current) clearTimeout(animRef.current);

    const newArr = Array.from({ length: 14 }, () => Math.floor(Math.random() * 75) + 15);
    setArray(newArr);
    setComparingIdxs([]);
    setSwappingIdxs([]);
    setSortedIdxs([]);
    setStats({ comparisons: 0, swaps: 0 });
  };

  useEffect(() => {
    generateNewArray();
  }, [algo]);

  const sleep = (ms) => new Promise(resolve => {
    animRef.current = setTimeout(resolve, ms);
  });

  // Algorithm Sorting Generators & Step Execution
  const runSortingAlgorithm = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      isSortingRef.current = false;
      if (animRef.current) clearTimeout(animRef.current);
      return;
    }

    setIsPlaying(true);
    isSortingRef.current = true;
    let arr = [...array];
    let comps = 0;
    let swaps = 0;

    const updateUI = async (comp = [], swap = [], sorted = []) => {
      setArray([...arr]);
      setComparingIdxs(comp);
      setSwappingIdxs(swap);
      setSortedIdxs(sorted);
      setStats({ comparisons: comps, swaps: swaps });
      await sleep(1050 - speed * 10);
    };

    // Bubble Sort Step Visualizer
    if (algo.id === 'bubble_sort') {
      const n = arr.length;
      const sortedList = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (!isSortingRef.current) return;
          comps++;
          await updateUI([j, j + 1], [], sortedList);

          if (arr[j] > arr[j + 1]) {
            swaps++;
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            await updateUI([j, j + 1], [j, j + 1], sortedList);
          }
        }
        sortedList.push(n - 1 - i);
      }
      setSortedIdxs(Array.from({ length: n }, (_, i) => i));
    } 
    // Selection Sort Step Visualizer
    else if (algo.id === 'selection_sort') {
      const n = arr.length;
      const sortedList = [];
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (!isSortingRef.current) return;
          comps++;
          await updateUI([j, minIdx], [], sortedList);
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          swaps++;
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          await updateUI([], [i, minIdx], sortedList);
        }
        sortedList.push(i);
      }
      setSortedIdxs(Array.from({ length: n }, (_, i) => i));
    }
    // Insertion Sort Step Visualizer
    else if (algo.id === 'insertion_sort') {
      const n = arr.length;
      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          if (!isSortingRef.current) return;
          comps++;
          swaps++;
          arr[j + 1] = arr[j];
          await updateUI([j, j + 1], [j, j + 1]);
          j--;
        }
        arr[j + 1] = key;
        await updateUI([j + 1], []);
      }
      setSortedIdxs(Array.from({ length: n }, (_, i) => i));
    }
    // General Quick / Merge / Heap Sort Step Visualizer Fallback
    else {
      // General partition visual simulation
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          if (!isSortingRef.current) return;
          comps++;
          await updateUI([j, minIdx], []);
          if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          swaps++;
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          await updateUI([], [i, minIdx]);
        }
      }
      setSortedIdxs(Array.from({ length: n }, (_, i) => i));
    }

    setIsPlaying(false);
    isSortingRef.current = false;
    setComparingIdxs([]);
    setSwappingIdxs([]);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Control Panel Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn-primary" onClick={runSortingAlgorithm}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause' : 'Start Sorting'}</span>
          </button>

          <button className="btn-secondary" onClick={generateNewArray} disabled={isPlaying}>
            <Shuffle size={16} />
            <span>Shuffle Array</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Speed:</span>
          <input
            type="range"
            min="50"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isPlaying}
            style={{ width: '120px', accentColor: 'var(--accent-indigo)' }}
          />
        </div>

        {/* Real-time Stats Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          <div style={{ color: 'var(--accent-cyan)' }}>
            Comparisons: <strong>{stats.comparisons}</strong>
          </div>
          <div style={{ color: 'var(--accent-rose)' }}>
            Swaps: <strong>{stats.swaps}</strong>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualizer Area */}
      <div className="glass-card" style={{
        height: '350px',
        padding: '2rem 1.5rem 1.5rem 1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '0.85rem',
        position: 'relative'
      }}>
        {array.map((val, idx) => {
          let barColor = 'rgba(99, 102, 241, 0.6)'; // Default Indigo
          if (comparingIdxs.includes(idx)) barColor = 'var(--accent-amber)';
          if (swappingIdxs.includes(idx)) barColor = 'var(--accent-rose)';
          if (sortedIdxs.includes(idx)) barColor = 'var(--accent-emerald)';

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                maxWidth: '45px',
                height: `${val * 3.5}px`,
                background: barColor,
                borderRadius: '6px 6px 0 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '0.4rem',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '700',
                fontFamily: 'var(--font-mono)',
                transition: 'height 0.15s ease, background 0.15s ease',
                boxShadow: comparingIdxs.includes(idx) || swappingIdxs.includes(idx) 
                  ? '0 0 15px ' + barColor 
                  : 'none'
              }}
            >
              {val}
            </div>
          );
        })}
      </div>
    </div>
  );
}
