import { useEffect, useState, type RefObject } from 'react';

/** Initialize expensive visuals only when they approach the viewport. */
export function useNearViewport(ref: RefObject<Element | null>, selector?: string) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const target = selector ? document.querySelector(selector) : ref.current;
    if (!target || ready) return;
    if (!('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '250px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [ref, selector, ready]);
  return ready;
}
