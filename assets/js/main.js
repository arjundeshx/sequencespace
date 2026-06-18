// Highlight nav link for current section
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '/' && path.startsWith(href)) {
      link.classList.add('active');
    }
  });
});

// Reading progress indicator on post pages
if (document.querySelector('.prose')) {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: var(--accent); z-index: 200;
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

// DNA ticker
function buildDna(el) {
  const bases = 'ATGC';
  let str = '';
  for (let i = 0; i < 400; i++) str += bases[Math.floor(Math.random() * 4)];
  (str + str).split('').forEach(b => {
    const s = document.createElement('span');
    s.textContent = b;
    s.className = b.toLowerCase();
    el.appendChild(s);
  });
}
document.querySelectorAll('.genome-strip-inner').forEach(buildDna);

// Hero stat count-up
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function countUp(el, target, duration) {
  if (reduceMotion || !target) { el.textContent = target; return; }
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}
document.querySelectorAll('.stat-num[data-target]').forEach((el, i) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  setTimeout(() => countUp(el, target, 800 + i * 150), 500);
});

// Node network canvas (hero visual)
(function () {
  const canvas = document.getElementById('nodeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  const NODE_COLORS = ['#0f766e', '#1d4ed8', '#92400e', '#6d28d9', '#b91c1c'];
  const EDGE_RGB = '110,128,118';

  const nodes = [];
  const N = 26;
  for (let i = 0; i < N; i++) {
    const isHub = i < 4;
    nodes.push({
      x: 50 + Math.random() * (W - 100),
      y: 50 + Math.random() * (H - 100),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: isHub ? 7 + Math.random() * 4 : 3 + Math.random() * 3,
      color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      isHub
    });
  }

  const edges = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const threshold = (nodes[i].isHub || nodes[j].isHub) ? 170 : 95;
      if (dist < threshold && Math.random() > 0.35) edges.push([i, j]);
    }
  }

  function hexToRgba(hex, alpha) {
    const v = parseInt(hex.slice(1), 16);
    const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    if (!reduceMotion) {
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 35 || n.x > W - 35) n.vx *= -1;
        if (n.y < 35 || n.y > H - 35) n.vy *= -1;
      });
    }

    edges.forEach(([i, j]) => {
      const a = nodes[i], b = nodes[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = (a.isHub || b.isHub) ? 190 : 110;
      if (dist > maxDist) return;
      const alpha = (1 - dist / maxDist) * 0.45;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(${EDGE_RGB},${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    nodes.forEach(n => {
      if (n.isHub) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(n.color, 0.25);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(n.color, 0.14);
      ctx.fill();
      ctx.strokeStyle = n.color;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });

    if (!reduceMotion) requestAnimationFrame(draw);
  }

  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 1s ease';
  setTimeout(() => { canvas.style.opacity = '1'; draw(); }, 350);
})();
