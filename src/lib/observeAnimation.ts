import { areAnimationsEnabled, subscribeMotionPreference } from './motionPreference';

/** Runs only while visible; add ?perf=1 in development to log rendered FPS. */
export function observeAnimation(element: Element, render: (elapsed: number) => void, fps = 30) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const debug = import.meta.env.DEV && new URLSearchParams(location.search).get('perf') === '1';
  let visible = false, frame = 0, lastTick = 0, lastDraw = 0, elapsed = 0, sampleStart = 0, frames = 0;
  const tick = (now: number) => {
    if (lastTick) elapsed += now - lastTick;
    lastTick = now;
    if (!lastDraw || now - lastDraw >= 1000 / fps - 1) {
      render(elapsed); lastDraw = now;
      if (debug) {
        if (!sampleStart) sampleStart = now;
        frames++;
        if (now - sampleStart >= 5000) { console.info(`[animation] ${element.className}: ${(frames * 1000 / (now - sampleStart)).toFixed(1)} rendered FPS`); sampleStart = now; frames = 0; }
      }
    }
    frame = requestAnimationFrame(tick);
  };
  const update = () => {
    cancelAnimationFrame(frame); frame = 0; lastTick = 0; lastDraw = 0; sampleStart = 0; frames = 0;
    if (visible && !document.hidden && !motion.matches && areAnimationsEnabled()) frame = requestAnimationFrame(tick);
    else if (visible && (motion.matches || !areAnimationsEnabled())) render(Infinity);
  };
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  intersection.observe(element);
  const unsubscribe = subscribeMotionPreference(update);
  motion.addEventListener('change', update); document.addEventListener('visibilitychange', update);
  return () => { cancelAnimationFrame(frame); intersection.disconnect(); unsubscribe(); motion.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
}
