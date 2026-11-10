export type AnalyticsChoice = 'accepted' | 'rejected';
export const CONSENT_KEY = 'homepage-analytics-consent-v1';
// GA4 measurement IDs are public identifiers. Keep the site ready to measure
// after consent even when the deployment has no custom Vite environment value.
const configuredId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const id = (configuredId === undefined ? 'G-BWESBJB5YE' : configuredId).trim();
export const measurementId = /^G-[A-Z0-9]+$/i.test(id) ? id : '';

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
export function readConsent(): AnalyticsChoice | null {
  try { const value = localStorage.getItem(CONSENT_KEY); return value === 'accepted' || value === 'rejected' ? value : null; } catch { return null; }
}
export function saveConsent(value: AnalyticsChoice) { try { localStorage.setItem(CONSENT_KEY, value); } catch { /* The choice still applies for this page. */ } }
export function enableAnalytics() {
  if (!measurementId) return;
  const w = window as AnalyticsWindow;
  Reflect.set(w, `ga-disable-${measurementId}`, false);
  if (w.gtag) { w.gtag('consent', 'update', { analytics_storage: 'granted' }); return; }
  w.dataLayer = w.dataLayer || [];
  w.gtag = function (...args: unknown[]) { void args; w.dataLayer?.push(arguments); };
  w.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  w.gtag('consent', 'update', { analytics_storage: 'granted' });
  w.gtag('js', new Date());
  w.gtag('config', measurementId, { allow_google_signals: false });
  const script = document.createElement('script'); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`; script.id = 'analytics-script'; document.head.appendChild(script);
}
export function disableAnalytics() {
  if (!measurementId) return;
  const w = window as AnalyticsWindow; Reflect.set(w, `ga-disable-${measurementId}`, true);
  w.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  const names = document.cookie.split(';').map(item => item.trim().split('=')[0]).filter(name => name === '_ga' || name.startsWith('_ga_'));
  const parts = location.hostname.split('.');
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=${parts.slice(i).join('.')}; SameSite=Lax`;
  }
}
