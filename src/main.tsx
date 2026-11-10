import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { CookieConsent } from './components/PrivacyNotice';
import { initializeMotionPreference } from './lib/motionPreference';
import './style.css';

initializeMotionPreference();
createRoot(document.getElementById('root')!).render(<StrictMode><App /><CookieConsent /></StrictMode>);
