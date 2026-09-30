import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Search, Sparkles, CheckCircle2, XCircle, Info, Zap } from 'lucide-react';

export default function StringMatchingVisualizer({ algo }) {
  const [mode, setMode] = useState(algo?.id === 'kmp_matching' ? 'kmp' : 'naive'); // 'naive' | 'kmp'
  const [text, setText] = useState('ABABDABACDABABCABAB');
  const [pattern, setPattern] = useState('ABABCABAB');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);

  // Sync mode if algo changes from sidebar
  useEffect(() => {
    if (algo?.id === 'kmp_matching') {
      setMode('kmp');
    } else if (algo?.id === 'naive_matching') {
      setMode('naive');
    }
  }, [algo]);

  // Compute LPS Array for KMP
  const computeLPS = (pat) => {
    const m = pat.length;
    const lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;
    while (i < m) {
      if (pat[i] === pat[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  };

  // Generate Naive Steps
  const generateNaiveSteps = (txt, pat) => {
    const steps = [];
    const n = txt.length;
    const m = pat.length;
    let comparisons = 0;
    const matches = [];

    steps.push({
      type: 'init',
      shift: 0,
      charIdx: 0,
      textIdx: 0,
      patternIdx: 0,
      status: 'idle',
      comparisons: 0,
      matches: [],
      desc: `Initialize Naive Search. Text Length = ${n}, Pattern Length = ${m}.`
    });

    for (let i = 0; i <= n - m; i++) {
      let j = 0;
      while (j < m) {
        comparisons++;
        const isMatch = txt[i + j] === pat[j];

        steps.push({
          type: 'compare',
          shift: i,
          charIdx: j,
          textIdx: i + j,
          patternIdx: j,
          status: isMatch ? 'match' : 'mismatch',
          comparisons,
          matches: [...matches],
          desc: isMatch
            ? `Shift ${i}: Matched '${txt[i + j]}' at text[${i + j}] with pattern[${j}].`
            : `Shift ${i}: Mismatch! '${txt[i + j]}' != '${pat[j]}' at text[${i + j}]. Moving to shift ${i + 1}.`
        });

        if (!isMatch) break;
        j++;
      }

      if (j === m) {
        matches.push(i);
        steps.push({
          type: 'found',
          shift: i,
          charIdx: m - 1,
          textIdx: i + m - 1,
          patternIdx: m - 1,
          status: 'full_match',
          comparisons,
          matches: [...matches],
          desc: `🎉 Pattern fully matched at text index ${i}!`
        });
      }
    }

    steps.push({
      type: 'complete',
      shift: n - m,
      charIdx: 0,
      textIdx: n,
      patternIdx: 0,
      status: 'done',
      comparisons,
      matches: [...matches],
      desc: `Naive Search Complete. Total comparisons: ${comparisons}. Matches found: ${matches.length}.`
    });

    return steps;
  };

  // Generate KMP Steps
  const generateKMPSteps = (txt, pat) => {
    const steps = [];
    const n = txt.length;
    const m = pat.length;
    const lps = computeLPS(pat);
    let comparisons = 0;
    const matches = [];

    steps.push({
      type: 'init',
      shift: 0,
      textIdx: 0,
      patternIdx: 0,
      lps,
      status: 'idle',
      comparisons: 0,
      matches: [],
      desc: `KMP Initialized. LPS Table precomputed in O(M) time. Zero text backtracking!`
    });

    let i = 0;
    let j = 0;

    while (i < n) {
      comparisons++;
      const isCharMatch = txt[i] === pat[j];

      if (isCharMatch) {
        steps.push({
          type: 'compare',
          shift: i - j,
          textIdx: i,
          patternIdx: j,
          lps,
          status: 'match',
          comparisons,
          matches: [...matches],
          desc: `Matched '${txt[i]}' at text[${i}] & pattern[${j}]. Advance both pointers (i -> ${i + 1}, j -> ${j + 1}).`
        });
        i++;
        j++;
      }

      if (j === m) {
        matches.push(i - j);
        steps.push({
          type: 'found',
          shift: i - j,
          textIdx: i - 1,
          patternIdx: j - 1,
          lps,
          status: 'full_match',
          comparisons,
          matches: [...matches],
          desc: `🎉 Pattern found at index ${i - j}! Using LPS[${j - 1}] = ${lps[j - 1]} to resume search without resetting i.`
        });
        j = lps[j - 1];
      } else if (i < n && !isCharMatch) {
        if (j !== 0) {
          const prevJ = j;
          const newJ = lps[j - 1];
          steps.push({
            type: 'lps_fallback',
            shift: i - newJ,
            textIdx: i,
            patternIdx: prevJ,
            lps,
            status: 'mismatch',
            comparisons,
            matches: [...matches],
            desc: `Mismatch at text[${i}] ('${txt[i]}') != pattern[${prevJ}] ('${pat[prevJ]}'). KMP fallback: Jump pattern index j from ${prevJ} to LPS[${prevJ - 1}] = ${newJ} (text pointer i remains at ${i}).`
          });
          j = newJ;
        } else {
          steps.push({
            type: 'advance_text',
            shift: i + 1,
            textIdx: i,
            patternIdx: 0,
            lps,
            status: 'mismatch',
            comparisons,
            matches: [...matches],
            desc: `Mismatch with first pattern character at text[${i}]. Advancing text pointer i to ${i + 1}.`
          });
          i++;
        }
      }
    }

    steps.push({
      type: 'complete',
      shift: i - j,
      textIdx: n,
      patternIdx: 0,
      lps,
      status: 'done',
      comparisons,
      matches: [...matches],
      desc: `KMP Search Complete. Total comparisons: ${comparisons}. Matches found: ${matches.length}.`
    });

    return steps;
  };

  const steps = mode === 'naive' ? generateNaiveSteps(text, pattern) : generateKMPSteps(text, pattern);
  const currentStep = steps[Math.min(currentStepIdx, steps.length - 1)] || steps[0];
  const lpsArray = computeLPS(pattern);

  // Auto-play timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  const handlePreset = (presetText, presetPat) => {
    setText(presetText);
    setPattern(presetPat);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Algorithm Mode Switcher & Presets */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Algorithm Strategy:
          </span>
          <div className="tab-group" style={{ margin: 0 }}>
            <button
              className={`tab-btn ${mode === 'naive' ? 'active' : ''}`}
              onClick={() => { setMode('naive'); setCurrentStepIdx(0); setIsPlaying(false); }}
            >
              <Search size={15} />
              <span>Naive Brute-Force</span>
            </button>
            <button
              className={`tab-btn ${mode === 'kmp' ? 'active' : ''}`}
              onClick={() => { setMode('kmp'); setCurrentStepIdx(0); setIsPlaying(false); }}
            >
              <Zap size={15} />
              <span>Knuth-Morris-Pratt (KMP)</span>
            </button>
          </div>
        </div>

        {/* Test Preset Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>Presets:</span>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handlePreset('ABABDABACDABABCABAB', 'ABABCABAB')}>
            Standard KMP Demo
          </button>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handlePreset('AAAAABAAAAAB', 'AAAAB')}>
            Worst-Case Repetition
          </button>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }} onClick={() => handlePreset('AGCTAGCTAGCTAC', 'AGCTA')}>
            DNA Motif
          </button>
        </div>
      </div>

      {/* Interactive Input Fields */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
            Source Text (N = {text.length})
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value.toUpperCase()); setCurrentStepIdx(0); setIsPlaying(false); }}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: '#38bdf8',
              padding: '0.6rem 0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: '600',
              letterSpacing: '0.1em'
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'block' }}>
            Search Pattern (M = {pattern.length})
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => { setPattern(e.target.value.toUpperCase()); setCurrentStepIdx(0); setIsPlaying(false); }}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: '#c084fc',
              padding: '0.6rem 0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: '600',
              letterSpacing: '0.1em'
            }}
          />
        </div>
      </div>

      {/* Playback Control Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))} disabled={currentStepIdx === 0 || isPlaying}>
            <ChevronLeft size={16} />
          </button>

          <button className="btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button className="btn-secondary" onClick={() => setCurrentStepIdx(prev => Math.min(steps.length - 1, prev + 1))} disabled={currentStepIdx >= steps.length - 1 || isPlaying}>
            <ChevronRight size={16} />
          </button>

          <button className="btn-secondary" onClick={() => { setCurrentStepIdx(0); setIsPlaying(false); }}>
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontFamily: 'var(--font-mono)' }}>
            Step {currentStepIdx + 1} / {steps.length}
          </span>
        </div>

        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>Speed:</span>
          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={1700 - playbackSpeed}
            onChange={(e) => setPlaybackSpeed(1700 - Number(e.target.value))}
            style={{ width: '100px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Current Step Description Callout */}
      <div className="glass-card" style={{
        padding: '0.85rem 1.25rem',
        borderLeft: currentStep.status === 'full_match' ? '4px solid var(--accent-emerald)' : currentStep.status === 'mismatch' ? '4px solid var(--accent-rose)' : '4px solid var(--accent-indigo)',
        background: 'rgba(15, 23, 42, 0.85)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        {currentStep.status === 'full_match' ? <CheckCircle2 size={20} color="var(--accent-emerald)" /> : currentStep.status === 'mismatch' ? <XCircle size={20} color="var(--accent-rose)" /> : <Info size={20} color="var(--accent-indigo)" />}
        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>
          {currentStep.desc}
        </span>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Comparisons Made</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-indigo)', fontFamily: 'var(--font-mono)' }}>
            {currentStep.comparisons}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Occurrences Found</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {currentStep.matches?.length || 0}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Shift Window / Text Index</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            i = {currentStep.textIdx ?? currentStep.shift}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Time Complexity</div>
          <div style={{ fontSize: '1.15rem', fontWeight: '800', color: mode === 'kmp' ? 'var(--accent-cyan)' : 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
            {mode === 'kmp' ? 'O(N + M)' : 'O((N-M+1) * M)'}
          </div>
        </div>
      </div>

      {/* Interactive Alignment Visual Canvas */}
      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span>Character Comparison & Alignment Matrix</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 'max-content' }}>
          {/* Text String Row */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: '600' }}>
              Text Array (N = {text.length})
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {text.split('').map((char, idx) => {
                const isCurrentTextPointer = currentStep.textIdx === idx;
                const isMatchedOccurrence = currentStep.matches?.some(mIdx => idx >= mIdx && idx < mIdx + pattern.length);
                const isInCurrentWindow = idx >= currentStep.shift && idx < currentStep.shift + pattern.length;
                const isComparingChar = isInCurrentWindow && (idx === currentStep.textIdx);

                let bg = 'rgba(15, 23, 42, 0.7)';
                let border = '1px solid var(--border-color)';
                let color = 'var(--text-main)';

                if (isMatchedOccurrence) {
                  bg = 'rgba(16, 185, 129, 0.25)';
                  border = '1px solid var(--accent-emerald)';
                  color = '#34d399';
                } else if (isComparingChar) {
                  if (currentStep.status === 'match') {
                    bg = 'rgba(16, 185, 129, 0.3)';
                    border = '2px solid var(--accent-emerald)';
                    color = '#34d399';
                  } else if (currentStep.status === 'mismatch') {
                    bg = 'rgba(244, 63, 94, 0.3)';
                    border = '2px solid var(--accent-rose)';
                    color = '#fb7185';
                  }
                } else if (isInCurrentWindow) {
                  bg = 'rgba(99, 102, 241, 0.15)';
                  border = '1px solid rgba(99, 102, 241, 0.4)';
                }

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                      {idx}
                    </span>
                    <div style={{
                      width: '38px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: bg,
                      border: border,
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-mono)',
                      color: color,
                      boxShadow: isComparingChar ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {char}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pattern String Row (Shifted under text) */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: '600' }}>
              Pattern Alignment (Shift = {currentStep.shift ?? 0})
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {/* Spacer boxes for shift alignment */}
              {Array.from({ length: Math.max(0, currentStep.shift || 0) }).map((_, sIdx) => (
                <div key={`spacer-${sIdx}`} style={{ width: '38px' }} />
              ))}

              {pattern.split('').map((char, pIdx) => {
                const isComparingPatternChar = pIdx === currentStep.patternIdx;
                let bg = 'rgba(30, 41, 59, 0.7)';
                let border = '1px solid rgba(168, 85, 247, 0.3)';
                let color = '#c084fc';

                if (isComparingPatternChar) {
                  if (currentStep.status === 'match') {
                    bg = 'rgba(16, 185, 129, 0.3)';
                    border = '2px solid var(--accent-emerald)';
                    color = '#34d399';
                  } else if (currentStep.status === 'mismatch') {
                    bg = 'rgba(244, 63, 94, 0.3)';
                    border = '2px solid var(--accent-rose)';
                    color = '#fb7185';
                  }
                }

                return (
                  <div key={pIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>
                      j={pIdx}
                    </span>
                    <div style={{
                      width: '38px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: bg,
                      border: border,
                      borderRadius: '6px',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-mono)',
                      color: color,
                      boxShadow: isComparingPatternChar ? '0 0 12px rgba(168, 85, 247, 0.5)' : 'none',
                      transition: 'all 0.2s ease'
                    }}>
                      {char}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* KMP LPS (Longest Prefix Suffix) Precomputed Table */}
      {mode === 'kmp' && (
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} color="var(--accent-cyan)" />
              <span>KMP Precomputed LPS (Longest Proper Prefix which is also Suffix) Table</span>
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'var(--font-mono)' }}>
              O(M) Preprocessing
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Pattern Index (j)</th>
                  {pattern.split('').map((_, idx) => (
                    <th key={idx} style={{ padding: '0.5rem', textAlign: 'center' }}>{idx}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '700', color: '#fff' }}>Character Pattern[j]</td>
                  {pattern.split('').map((char, idx) => (
                    <td key={idx} style={{ padding: '0.5rem', textAlign: 'center', color: '#c084fc', fontWeight: '700' }}>
                      {char}
                    </td>
                  ))}
                </tr>
                <tr style={{ background: 'rgba(6, 182, 212, 0.08)' }}>
                  <td style={{ padding: '0.5rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>LPS[j] Value</td>
                  {lpsArray.map((val, idx) => {
                    const isHighlighted = currentStep.patternIdx === idx;
                    return (
                      <td key={idx} style={{
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontWeight: '800',
                        color: isHighlighted ? '#fff' : 'var(--accent-cyan)',
                        background: isHighlighted ? 'var(--accent-indigo)' : 'transparent',
                        borderRadius: isHighlighted ? '4px' : '0'
                      }}>
                        {val}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.75rem', lineHeight: '1.5' }}>
            💡 <strong>Why LPS works:</strong> When a mismatch occurs at index <code>j</code>, we know characters <code>Pattern[0...j-1]</code> already matched with text. <code>LPS[j-1]</code> tells us the length of the longest proper prefix that matches a suffix within that substring, so we jump directly to <code>j = LPS[j-1]</code> without re-examining matched characters or backtracking the text pointer <code>i</code>!
          </p>
        </div>
      )}

      {/* Comparative Performance Analysis Box */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.85rem' }}>
          📊 Theoretical & Empirical Performance Comparison
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Algorithm</th>
                <th style={{ padding: '0.5rem' }}>Best Case Time</th>
                <th style={{ padding: '0.5rem' }}>Worst Case Time</th>
                <th style={{ padding: '0.5rem' }}>Space Complexity</th>
                <th style={{ padding: '0.5rem' }}>Text Backtracking</th>
                <th style={{ padding: '0.5rem' }}>Key Advantage</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: mode === 'naive' ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>Naive Approach</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>O(N)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>O((N-M+1) * M)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>O(1)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-rose)' }}>Yes (Backtracks i)</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-dim)' }}>Simple to implement, no preprocessing needed.</td>
              </tr>
              <tr style={{ background: mode === 'kmp' ? 'rgba(6, 182, 212, 0.1)' : 'transparent' }}>
                <td style={{ padding: '0.65rem', fontWeight: '700', color: '#fff' }}>Knuth-Morris-Pratt (KMP)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>O(N)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>O(N + M)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>O(M)</td>
                <td style={{ padding: '0.65rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>Never (i is linear)</td>
                <td style={{ padding: '0.65rem', color: 'var(--text-dim)' }}>Strict linear bound; ideal for streaming data and repetitive patterns.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
