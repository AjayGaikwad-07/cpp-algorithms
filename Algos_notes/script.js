/* ==========================================================================
   ALGORITHM NOTES — HANDWRITTEN NOTEBOOK INTERACTION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Notebook Notes loaded successfully.');
});

// Scroll smoothly to a specific section or page ID
function scrollToPage(pageId) {
  const element = document.getElementById(pageId) || document.querySelector('.' + pageId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateActiveTab(pageId);
  }
}

// Update Active Nav Tab State
function updateActiveTab(activeId) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    if (tab.getAttribute('onclick') && tab.getAttribute('onclick').includes(activeId)) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

// Toggle Solution Box Visibility
function toggleSolution(btn) {
  const container = btn.closest('.solution-toggle');
  if (!container) return;
  
  const content = container.querySelector('.solution-content');
  if (!content) return;

  if (content.style.display === 'none' || content.style.display === '') {
    content.style.display = 'block';
    btn.innerHTML = '🙈 Hide Solution';
  } else {
    content.style.display = 'none';
    btn.innerHTML = '💡 Show Solution';
  }
}

// Keyboard shortcuts for quick navigation
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key === '1') scrollToPage('sorting');
  if (e.altKey && e.key === '2') scrollToPage('greedy');
  if (e.altKey && e.key === '3') scrollToPage('graph');
  if (e.altKey && e.key === 'p') window.print();
});
