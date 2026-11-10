import { useEffect, useState } from 'react';
import { disableAnalytics, enableAnalytics, readConsent, saveConsent, type AnalyticsChoice } from '../lib/analytics';
import './CookieConsent.css';

export function CookieConsent() {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(readConsent);
  const [open, setOpen] = useState(() => readConsent() === null);
  const [language, setLanguage] = useState(() => document.documentElement.lang === 'pt-BR' ? 'pt' : 'en');
  useEffect(() => { if (choice === 'accepted') enableAnalytics(); else disableAnalytics(); }, [choice]);
  useEffect(() => {
    const show = () => setOpen(true);
    const sync = () => setLanguage(document.documentElement.lang === 'pt-BR' ? 'pt' : 'en');
    window.addEventListener('open-cookie-settings', show); window.addEventListener('homepage-language-change', sync); sync();
    return () => { window.removeEventListener('open-cookie-settings', show); window.removeEventListener('homepage-language-change', sync); };
  }, []);
  const select = (value: AnalyticsChoice) => { if (value === 'rejected') disableAnalytics(); saveConsent(value); setChoice(value); setOpen(false); };
  if (!open) return null;
  const pt = language === 'pt';
  return <aside className="cookie-banner" aria-labelledby="cookie-title" aria-describedby="cookie-description"><div><p id="cookie-title" className="cookie-title">{pt ? 'COOKIES DE ANÁLISE' : 'ANALYTICS COOKIES'}</p><p id="cookie-description">{pt ? 'Este portfólio pode usar o Google Analytics para entender as visitas e melhorar a experiência. Você pode aceitar ou recusar. ' : 'This portfolio may use Google Analytics to understand visits and improve the experience. You can accept or decline. '}<a href="/privacy">{pt ? 'Leia a Política de Privacidade.' : 'Read the Privacy Policy.'}</a></p></div><div className="cookie-actions"><button type="button" onClick={() => select('accepted')}>{pt ? 'ACEITAR' : 'ACCEPT'}</button><button type="button" onClick={() => select('rejected')}>{pt ? 'RECUSAR' : 'DECLINE'}</button></div></aside>;
}
