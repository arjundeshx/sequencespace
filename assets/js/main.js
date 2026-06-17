// Highlight nav link for current section
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href !== '/' && path.startsWith(href)) {
      link.classList.add('active');
    }
  });
});

// Smooth reading progress indicator (optional)
if (document.querySelector('.prose')) {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: var(--teal); z-index: 200;
    width: 0%; transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
  }, { passive: true });
}
