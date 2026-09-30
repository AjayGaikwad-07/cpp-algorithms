// ============================================
//   ALGORITHM NOTES — INTERACTIVE JAVASCRIPT
// ============================================

// ---- Section Navigation ----
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(name).classList.add('active');
  document.querySelector(`[data-section="${name}"]`).classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateProgress();
}

// ---- Toggle Card Expand/Collapse ----
function toggleCard(btn) {
  const card = btn.closest('.algo-card');
  const body = card.querySelector('.card-body');

  if (body.classList.contains('hidden')) {
    body.classList.remove('hidden');
    btn.classList.remove('collapsed');
    btn.textContent = '▼';
    body.style.animation = 'fadeSlideIn 0.4s ease';
  } else {
    body.classList.add('hidden');
    btn.classList.add('collapsed');
    btn.textContent = '▶';
  }
}

// ---- Toggle Solution Visibility ----
function toggleSolution(id) {
  const sol = document.getElementById(id);
  const btn = sol.previousElementSibling;

  if (sol.classList.contains('visible')) {
    sol.classList.remove('visible');
    btn.textContent = '💡 Show Solution';
  } else {
    sol.classList.add('visible');
    btn.textContent = '🙈 Hide Solution';
    sol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ---- Copy Code ----
function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent).then(() => {
    const original = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.style.color = '#34d399';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.color = '';
    }, 2000);
  });
}

// ---- Quick Ref Panel ----
function toggleQuickRef() {
  const panel = document.getElementById('quickRefPanel');
  panel.classList.toggle('visible');
}

// Close quick ref when clicking outside
document.addEventListener('click', (e) => {
  const qr = document.querySelector('.quick-ref');
  if (!qr.contains(e.target)) {
    document.getElementById('quickRefPanel').classList.remove('visible');
  }
});

// ---- Progress Bar ----
window.addEventListener('scroll', updateProgress);
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  document.getElementById('progressBar').style.width = pct + '%';
}

// ==============================================================
//   BUBBLE SORT VISUALIZATION
// ==============================================================
const BUBBLE_ARR = [64, 34, 25, 12, 22];
let bubbleRunning = false;

function initBubbleBars() {
  const container = document.getElementById('bubbleBars');
  if (!container) return;
  container.innerHTML = '';
  const max = Math.max(...BUBBLE_ARR);
  BUBBLE_ARR.forEach(val => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${(val / max) * 100}px`;
    bar.innerHTML = `<span>${val}</span>`;
    container.appendChild(bar);
  });
}

async function startBubble() {
  if (bubbleRunning) return;
  bubbleRunning = true;
  const btn = document.querySelector('[onclick="startBubble()"]');
  btn.disabled = true;

  const arr = [...BUBBLE_ARR];
  const container = document.getElementById('bubbleBars');
  const stepInfo = document.getElementById('bubbleStep');
  const max = Math.max(...arr);

  function getBars() { return container.querySelectorAll('.bar'); }

  function setHeights(arr) {
    const bars = getBars();
    arr.forEach((val, i) => {
      bars[i].style.height = `${(val / max) * 100}px`;
      bars[i].querySelector('span').textContent = val;
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      const bars = getBars();
      bars[j].classList.add('comparing');
      bars[j + 1].classList.add('comparing');
      stepInfo.textContent = `Pass ${i+1}: Comparing ${arr[j]} and ${arr[j+1]}`;
      await sleep(500);

      if (arr[j] > arr[j + 1]) {
        bars[j].classList.add('swapping');
        bars[j + 1].classList.add('swapping');
        stepInfo.textContent = `Swapping ${arr[j]} ↔ ${arr[j+1]}`;
        await sleep(300);

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setHeights(arr);
        await sleep(300);
      }

      bars[j].classList.remove('comparing', 'swapping');
      bars[j + 1].classList.remove('comparing', 'swapping');
    }
    getBars()[arr.length - 1 - i].classList.add('sorted');
  }

  getBars()[0].classList.add('sorted');
  stepInfo.textContent = '✅ Array sorted!';
  bubbleRunning = false;
  btn.disabled = false;
  btn.textContent = '↺ Reset & Run';
  btn.onclick = () => { initBubbleBars(); bubbleRunning = false; btn.textContent = '▶ Run Bubble Sort'; btn.onclick = startBubble; };
}

// ==============================================================
//   BFS ANIMATION
// ==============================================================
async function animateBFS() {
  const nodes = [
    { id: 0, el: document.getElementById('bfsN0') },
    { id: 1, el: document.getElementById('bfsN1') },
    { id: 2, el: document.getElementById('bfsN2') },
    { id: 3, el: document.getElementById('bfsN3') },
    { id: 4, el: document.getElementById('bfsN4') }
  ];

  const adj = { 0: [1, 2], 1: [3, 4], 2: [4], 3: [], 4: [] };
  const stepInfo = document.getElementById('bfsStepInfo');
  const btn = document.querySelector('[onclick="animateBFS()"]');
  btn.disabled = true;

  // Reset
  nodes.forEach(n => { n.el.className.baseVal = 'graph-node'; });

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  const visited = new Set();
  const queue = [0];
  visited.add(0);
  const order = [];

  nodes[0].el.classList.add('current');
  stepInfo.textContent = 'Queue: [0]';
  await sleep(600);

  while (queue.length > 0) {
    const v = queue.shift();
    nodes[v].el.className.baseVal = 'graph-node visited';
    order.push(v);
    stepInfo.textContent = `Visiting node ${v} | Order: [${order.join(' → ')}]`;
    await sleep(700);

    for (const u of adj[v]) {
      if (!visited.has(u)) {
        visited.add(u);
        queue.push(u);
        nodes[u].el.className.baseVal = 'graph-node queued';
        stepInfo.textContent = `Add ${u} to queue | Queue: [${queue.join(',')}]`;
        await sleep(500);
      }
    }
  }

  stepInfo.textContent = `✅ BFS Complete! Order: ${order.join(' → ')}`;
  btn.disabled = false;
}

// ==============================================================
//   SCROLL-TRIGGERED CARD ANIMATIONS
// ==============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

function setupAnimations() {
  document.querySelectorAll('.algo-card, .comparison-card, .intro-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}

// ==============================================================
//   KEYBOARD SHORTCUTS
// ==============================================================
document.addEventListener('keydown', (e) => {
  if (e.altKey) {
    if (e.key === '1') showSection('sorting');
    if (e.key === '2') showSection('greedy');
    if (e.key === '3') showSection('graph');
  }
});

// ==============================================================
//   SEARCH / HIGHLIGHT (Simple keyword highlight)
// ==============================================================
function addSearchBar() {
  const nav = document.querySelector('.main-nav');
  const searchDiv = document.createElement('div');
  searchDiv.style.cssText = 'position:relative;margin-left:16px;';
  searchDiv.innerHTML = `
    <input id="searchInput" type="text" placeholder="🔍 Search algo..."
      style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);
      color:#f1f5f9;padding:8px 16px;border-radius:50px;font-size:0.85rem;
      outline:none;font-family:Inter,sans-serif;width:180px;transition:all 0.3s;"
      oninput="handleSearch(this.value)"
      onfocus="this.style.borderColor='rgba(129,140,248,0.5)'"
      onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
    />
  `;
  nav.appendChild(searchDiv);
}

function handleSearch(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.algo-card');
  let anyFound = false;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (!q || text.includes(q)) {
      card.style.display = '';
      anyFound = true;
    } else {
      card.style.display = 'none';
    }
  });

  // Auto-switch to correct section
  if (q) {
    const sortingTerms = ['bubble','selection','insertion','merge','quick','heap','sort'];
    const greedyTerms = ['greedy','activity','knapsack','huffman','job','coin'];
    const graphTerms = ['bfs','dfs','dijkstra','bellman','kruskal','prim','floyd','topological'];

    if (sortingTerms.some(t => q.includes(t))) showSection('sorting');
    else if (greedyTerms.some(t => q.includes(t))) showSection('greedy');
    else if (graphTerms.some(t => q.includes(t))) showSection('graph');
  }
}

// ==============================================================
//   TYPEWRITER EFFECT ON HERO
// ==============================================================
function typewriterEffect() {
  const titles = ['Sorting Algorithms', 'Greedy Algorithms', 'Graph Algorithms', 'Algorithm Notes'];
  let tIdx = 0, cIdx = 0, deleting = false;
  const el = document.querySelector('.hero-sub');
  if (!el) return;

  const original = el.textContent;
  el.style.borderRight = '2px solid #818cf8';

  function type() {
    const current = titles[tIdx];
    if (deleting) {
      el.textContent = 'Sorting · Greedy · Graph Algorithms';
      return; // Keep original static for stability
    }
  }
}

// ==============================================================
//   FLOATING PARTICLES
// ==============================================================
function createParticles() {
  const count = 15;
  const container = document.querySelector('.bg-orbs');

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: rgba(129,140,248,${Math.random() * 0.4 + 0.1});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: floatParticle ${Math.random() * 15 + 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * -15}s;
      pointer-events: none;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%, 100% { transform: translate(0,0) scale(1); opacity: 0.3; }
      25% { transform: translate(${Math.random()*60-30}px, ${Math.random()*60-30}px) scale(1.2); opacity: 0.7; }
      50% { transform: translate(${Math.random()*60-30}px, ${Math.random()*60-30}px) scale(0.8); opacity: 0.4; }
      75% { transform: translate(${Math.random()*60-30}px, ${Math.random()*60-30}px) scale(1.1); opacity: 0.6; }
    }
  `;
  document.head.appendChild(style);
}

// ==============================================================
//   TOOLTIP SYSTEM
// ==============================================================
function initTooltips() {
  const tooltips = {
    'O(n)': 'Linear time — grows proportionally with input',
    'O(n²)': 'Quadratic time — doubles input = 4x slower',
    'O(n log n)': 'Linearithmic — efficient for large data',
    'O(V+E)': 'Vertices + Edges — standard graph complexity',
    'O(1)': 'Constant space — no extra memory needed'
  };

  document.querySelectorAll('.comp-table td, .big-table td').forEach(td => {
    const text = td.textContent.trim();
    if (tooltips[text]) {
      td.title = tooltips[text];
      td.style.cursor = 'help';
    }
  });
}

// ==============================================================
//   CARD COUNTER ANIMATION
// ==============================================================
function animateCounters() {
  const cards = document.querySelectorAll('.algo-card');
  let visible = 0;
  cards.forEach(c => { if (c.style.display !== 'none') visible++; });
}

// ==============================================================
//   SMOOTH NAV HIGHLIGHT ON SCROLL
// ==============================================================
function updateNavOnScroll() {
  const sections = ['sorting', 'greedy', 'graph'];
  const activeSection = sections.find(s => {
    const el = document.getElementById(s);
    return el && el.classList.contains('active');
  });

  if (activeSection) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`[data-section="${activeSection}"]`);
    if (btn) btn.classList.add('active');
  }
}

// ==============================================================
//   ALGO CARD — STAR RATING
// ==============================================================
function addComplexityIndicators() {
  const ratings = {
    'bubble-sort': 1, 'selection-sort': 1, 'insertion-sort': 1,
    'merge-sort': 3, 'quick-sort': 3, 'heap-sort': 3,
    'activity-selection': 2, 'fractional-knapsack': 2, 'huffman': 3,
    'job-sequencing': 2, 'coin-change': 1,
    'bfs': 2, 'dfs': 2, 'dijkstra': 3, 'bellman-ford': 3,
    'kruskal': 3, 'prims': 3, 'floyd-warshall': 4, 'topological-sort': 2
  };
}

// ==============================================================
//   INITIALIZE
// ==============================================================
document.addEventListener('DOMContentLoaded', () => {
  initBubbleBars();
  setupAnimations();
  createParticles();
  addSearchBar();
  updateProgress();

  // Tooltip init after slight delay for DOM settle
  setTimeout(initTooltips, 500);

  // Add smooth entrance to hero
  const hero = document.querySelector('.hero-content');
  if (hero) {
    hero.style.animation = 'fadeSlideIn 0.8s ease';
  }

  // Add keyboard shortcut hint to nav
  const nav = document.querySelector('.main-nav');
  if (nav) {
    const hint = document.createElement('span');
    hint.style.cssText = 'font-size:0.7rem;color:#4b5563;align-self:center;margin-left:8px;';
    hint.textContent = 'Alt+1/2/3';
    nav.appendChild(hint);
  }

  console.log(`
  ╔═══════════════════════════════════╗
  ║   Algorithm Notes — Loaded! 🎉   ║
  ║   Alt+1: Sorting                  ║
  ║   Alt+2: Greedy                   ║
  ║   Alt+3: Graph                    ║
  ╚═══════════════════════════════════╝
  `);
});

// ---- Extra: Ripple effect on solution buttons ----
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('sol-btn') || e.target.classList.contains('demo-btn')) {
    const btn = e.target;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      top: ${e.clientY - rect.top - size/2}px;
      left: ${e.clientX - rect.left - size/2}px;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    const style = document.createElement('style');
    style.textContent = `@keyframes ripple { to { transform: scale(2); opacity: 0; } }`;
    document.head.appendChild(style);
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }
});
