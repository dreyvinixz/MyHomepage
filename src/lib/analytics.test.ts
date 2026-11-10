// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function analytics(id: string) { vi.stubEnv('VITE_GA_MEASUREMENT_ID', id); vi.resetModules(); return import('./analytics'); }

describe('analytics consent', () => {
  beforeEach(() => { localStorage.clear(); document.head.innerHTML = ''; delete (window as Window & { gtag?: unknown }).gtag; delete (window as Window & { dataLayer?: unknown }).dataLayer; });
  afterEach(() => { vi.unstubAllEnvs(); });
  it('does not load analytics without a configured measurement ID', async () => {
    const module = await analytics(''); module.enableAnalytics();
    expect(document.querySelector('#analytics-script')).toBeNull();
  });
  it('loads Google only after enable is called and sets default consent first', async () => {
    const module = await analytics('G-TEST123');
    expect(document.querySelector('#analytics-script')).toBeNull();
    module.enableAnalytics();
    expect(document.querySelector<HTMLScriptElement>('#analytics-script')?.src).toContain('id=G-TEST123');
    const data = Reflect.get(window, 'dataLayer') as unknown[][];
    expect(data[0][0]).toBe('consent'); expect(data[0][1]).toBe('default');
    expect(data[1][1]).toBe('update');
  });
  it('stores choices and disables analytics when consent is withdrawn', async () => {
    const module = await analytics('G-TEST123'); module.saveConsent('accepted'); expect(module.readConsent()).toBe('accepted');
    module.enableAnalytics(); document.cookie = '_ga=test; path=/'; module.disableAnalytics(); module.saveConsent('rejected');
    expect(module.readConsent()).toBe('rejected'); expect(Reflect.get(window, 'ga-disable-G-TEST123')).toBe(true); expect(document.cookie).not.toContain('_ga=');
  });
});
