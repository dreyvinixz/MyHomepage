const canvas = document.querySelector('#particle-field');
const ctx = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const points = Array.from({length: 12000}, () => ({ t: Math.random() * Math.PI * 2, a: Math.random() * Math.PI * 2, r: Math.sqrt(Math.random()), s: Math.random() }));
let w, h, frame = 0;
function resize() { const d = Math.min(devicePixelRatio, 2); w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w*d; canvas.height = h*d; ctx.setTransform(d,0,0,d,0,0); }
function draw() {
  ctx.clearRect(0,0,w,h);
  const scale = Math.min(w * .37, 440), cy = h * .51;
  for (const p of points) {
    const t = p.t + frame * .0008, x = Math.sin(t), y = Math.sin(2*t)*.42;
    const spread = (.055 + .14 * p.r), dx = Math.cos(p.a)*spread, dy = Math.sin(p.a)*spread;
    const px = w/2 + (x+dx)*scale, py = cy + (y+dy)*scale;
    ctx.fillStyle = p.s > .7 ? 'rgba(255,255,255,.8)' : 'rgba(174,199,255,.65)';
    const size = p.s > .95 ? 2 : 1; ctx.fillRect(px,py,size,size);
  }
  frame++; if (!reduced.matches) requestAnimationFrame(draw);
}
resize(); draw(); addEventListener('resize', () => { resize(); if (reduced.matches) draw(); });
