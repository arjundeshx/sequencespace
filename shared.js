// ── DNA TICKER ──
function buildDna(id) {
  const bases = 'ATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGCATGC';
  const strip = document.getElementById(id);
  if (!strip) return;
  const full = bases.repeat(2);
  full.split('').forEach(b => {
    const s = document.createElement('span');
    s.textContent = b;
    s.className = b.toLowerCase();
    strip.appendChild(s);
  });
}

// ── CARD HOVER GLOW ──
function initCardGlow(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(220px at ${x}px ${y}px, rgba(0,212,168,0.07), var(--bg3))`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });
}

// ── NEWSLETTER SUBMIT ──
function initNewsletter() {
  const btn = document.querySelector('.nl-btn');
  const input = document.querySelector('.nl-input');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    if (input.value.includes('@')) {
      btn.textContent = 'Subscribed ✓';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#080c10';
      input.value = '';
      input.placeholder = 'Thanks! Check your inbox.';
    } else {
      input.style.borderColor = 'var(--accent3)';
      input.placeholder = 'Enter a valid email';
      input.value = '';
    }
  });
}
