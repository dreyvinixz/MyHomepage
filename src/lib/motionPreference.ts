import { gsap } from 'gsap';

const STORAGE_KEY = 'homepage-motion-preference-v1';
const CHANGE_EVENT = 'homepage-motion-preference-change';

function storedPreference(): 'on' | 'off' | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'on' || value === 'off' ? value : null;
  } catch {
    return null;
  }
}

export function areAnimationsEnabled() {
  const preference = storedPreference();
  return preference === null ? !matchMedia('(prefers-reduced-motion: reduce)').matches : preference === 'on';
}

export function setAnimationsEnabled(enabled: boolean) {
  try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch { /* The current page still follows this choice. */ }
  applyPreference();
  if (!enabled) finishAnimations();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function finishAnimations() {
  // Complete active entrance animations so their elements cannot remain invisible.
  gsap.globalTimeline.getChildren(false, true, true).forEach(animation => animation.progress(1));
}

export function subscribeMotionPreference(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

function applyPreference() {
  const enabled = areAnimationsEnabled();
  document.documentElement.dataset.animations = enabled ? 'on' : 'off';
}

export function initializeMotionPreference() {
  applyPreference();
  const systemPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const onSystemPreferenceChange = () => {
    if (storedPreference() === null) {
      applyPreference();
      if (!areAnimationsEnabled()) finishAnimations();
      window.dispatchEvent(new Event(CHANGE_EVENT));
    }
  };
  systemPreference.addEventListener('change', onSystemPreferenceChange);
}


