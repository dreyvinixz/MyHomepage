import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { CookieConsent } from './components/CookieConsent';
import './style.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /><CookieConsent /></StrictMode>);
