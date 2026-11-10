import { useEffect, useRef } from 'react';

export function QuantBaseVisual() {
  const chart = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = chart.current;
    if (!svg) return;
    let visible = false;
    const update = () => {
      const active = visible && !document.hidden;
      if (active) svg.dataset.started = 'true';
      svg.dataset.playing = active ? 'true' : 'false';
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: .1 });
    observer.observe(svg);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  return <>
    <svg ref={chart} className="quantbase-chart" viewBox="0 0 930 350" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="quantbase-chart-color" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#6caaff" stopOpacity=".08"/><stop offset=".55" stopColor="#83bcff" stopOpacity=".55"/><stop offset="1" stopColor="#e3f5ff"/></linearGradient>
        <filter id="quantbase-point-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>
      <path className="quantbase-chart-line" pathLength="1" d="M0 274 L8 277 14 293 19 285 24 297 31 290 37 305 44 286 51 290 59 314 65 302 70 319 75 300 82 295 89 302 96 293 103 260 109 255 115 269 122 250 130 245 139 249 145 267 151 247 160 238 167 265 175 277 182 266 188 283 194 289 200 319 207 301 215 296 221 274 227 284 233 274 239 291 246 299 252 283 259 295 265 281 272 288 279 268 286 265 293 269 301 294 309 298 317 295 325 301 332 288 338 305 345 303 353 320 362 310 369 297 375 301 382 284 388 288 395 299 401 279 408 269 414 277 422 269 428 278 434 267 440 275 446 261 454 256 461 266 467 275 474 279 480 269 487 276 492 266 500 271 506 279 511 279 516 267 522 260 528 248 534 240 542 239 548 232 554 242 560 236 566 244 572 240 578 224 584 219 590 236 596 230 602 238 608 209 614 207 620 198 626 176 630 147 635 158 640 141 645 154 650 135 657 144 664 130 671 104 678 96 685 99 692 103 699 132 706 110 713 105 720 108 727 108 734 113 741 77 748 108 755 92 762 94 769 96 776 109 783 101 790 81 797 86 804 74 811 69 818 45 825 91 832 87 839 101 846 111 853 123 860 99 867 102 874 120 881 114 888 129 895 116 902 105 909 98 916 74" stroke="url(#quantbase-chart-color)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
      <circle className="quantbase-chart-end" cx="916" cy="74" r="10" fill="#9ed2ff" opacity=".65" filter="url(#quantbase-point-glow)"/><circle className="quantbase-chart-end" cx="916" cy="74" r="4" fill="#f4fbff"/>
    </svg>
    <img className="work-project-logo" src="/projects/quantbase-logo.svg" alt="" loading="lazy" />
  </>;
}
