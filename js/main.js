// 1. Custom cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursor.style.opacity = 1;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('big'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
});

// 2. Project filter tabs
const tabs = document.getElementById('tabs');
tabs.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
  document.querySelectorAll('#cards .card').forEach(card => {
    card.classList.toggle('hide', btn.dataset.f !== 'all' && card.dataset.cat !== btn.dataset.f);
  });
});

// 3. Reveal sections on scroll
const revealTargets = document.querySelectorAll('.sec > *, .logos');
revealTargets.forEach(el => el.classList.add('rev'));
const revealer = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => revealer.observe(el));

// 4. Count-up numbers
function countUp(el) {
  const end = Number(el.dataset.count);
  let n = 0;
  const timer = setInterval(() => {
    n++;
    el.textContent = n;
    if (n >= end) clearInterval(timer);
  }, 140);
}
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { countUp(en.target); counterObs.unobserve(en.target); }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterObs.observe(c));

// 5. Raw table to chart (sample data from data/sales.json)
const fallback = [
  { month: 'Jan', sales: 42 }, { month: 'Feb', sales: 38 }, { month: 'Mar', sales: 55 },
  { month: 'Apr', sales: 61 }, { month: 'May', sales: 58 }, { month: 'Jun', sales: 74 }
];
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const table = document.getElementById('table');
let data = fallback;

function drawChart(progress) {
  const w = canvas.width, h = canvas.height, pad = 40;
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...data.map(d => d.sales)) * 1.1;
  const slot = (w - pad * 2) / data.length;
  ctx.font = '14px DM Sans, sans-serif';
  ctx.textAlign = 'center';
  data.forEach((d, i) => {
    const bh = (d.sales / max) * (h - pad * 2) * progress;
    const x = pad + i * slot + slot * 0.2;
    const y = h - pad - bh;
    ctx.fillStyle = i === data.length - 1 ? '#e5262b' : '#5a1517';
    ctx.fillRect(x, y, slot * 0.6, bh);
    ctx.fillStyle = '#9a9aa2';
    ctx.fillText(d.month, x + slot * 0.3, h - 14);
    if (progress > 0.95) { ctx.fillStyle = '#f5f5f5'; ctx.fillText(d.sales, x + slot * 0.3, y - 8); }
  });
}
function animateChart() {
  const start = performance.now();
  (function frame(t) {
    const p = Math.min((t - start) / 900, 1);
    drawChart(1 - Math.pow(1 - p, 3));
    if (p < 1) requestAnimationFrame(frame);
  })(start);
}
function buildTable() {
  table.innerHTML = '<tr><th>Month</th><th>Sales (sample)</th></tr>' +
    data.map(d => '<tr><td>' + d.month + '</td><td>' + d.sales + '</td></tr>').join('');
}
fetch('data/sales.json')
  .then(r => r.json())
  .then(json => { data = json; })
  .catch(() => { data = fallback; })   // happens if opened without a server
  .finally(() => { buildTable(); animateChart(); });

document.getElementById('view').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#view button').forEach(b => b.classList.toggle('on', b === btn));
  const showChart = btn.dataset.v === 'chart';
  canvas.hidden = !showChart;
  table.hidden = showChart;
  if (showChart) animateChart();
});
