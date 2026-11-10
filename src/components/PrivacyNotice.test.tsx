// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { CookieConsent } from './PrivacyNotice';
import { CONSENT_KEY } from '../lib/analytics';

describe('cookie preferences', () => {
  beforeEach(() => { localStorage.clear(); document.documentElement.lang = 'en'; });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });
  it('offers both choices, stores refusal, and can be reopened', () => {
    render(<CookieConsent />); expect(screen.getByText('ANALYTICS COOKIES')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'DECLINE' }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('rejected'); expect(screen.queryByText('ANALYTICS COOKIES')).toBeNull();
    fireEvent(window, new Event('open-cookie-settings')); expect(screen.getByText('ANALYTICS COOKIES')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'ACCEPT' })); expect(localStorage.getItem(CONSENT_KEY)).toBe('accepted');
  });
  it('does not reopen automatically after a saved choice', () => {
    localStorage.setItem(CONSENT_KEY, 'rejected'); render(<CookieConsent />); expect(screen.queryByText('ANALYTICS COOKIES')).toBeNull();
  });
});
