import { useEffect, useState } from 'react';
import type { Language } from '../translations';
import { areAnimationsEnabled, setAnimationsEnabled, subscribeMotionPreference } from '../lib/motionPreference';

export function AnimationToggle({ language }: { language: Language }) {
  const [enabled, setEnabled] = useState(areAnimationsEnabled);
  useEffect(() => subscribeMotionPreference(() => setEnabled(areAnimationsEnabled())), []);
  const label = language === 'pt'
    ? `Animações ${enabled ? 'ligadas' : 'desligadas'}`
    : `Animations ${enabled ? 'on' : 'off'}`;

  return <button
    className="motion-toggle"
    type="button"
    aria-label={label}
    aria-pressed={enabled}
    title={label}
    onClick={() => setAnimationsEnabled(!enabled)}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12c2.3-5 4.7-5 7 0s4.7 5 7 0 4.7-5 7-0" />
    </svg>
    <span aria-hidden="true">{language === 'pt' ? 'MOV' : 'MOTION'}</span>
    <i className="motion-toggle-indicator" aria-hidden="true" />
  </button>;
}
