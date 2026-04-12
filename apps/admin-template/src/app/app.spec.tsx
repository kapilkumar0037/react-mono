import { act, fireEvent, render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('shows the login screen when there is no active session', async () => {
    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  });

  it('restores a remembered session from storage', async () => {
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeTruthy();
    expect(screen.getAllByText(/demo@example.com/i).length).toBeGreaterThan(0);
  });

  it('restores the stored collapsed sidebar preference', async () => {
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );
    localStorage.setItem('admin-template.sidebar-collapsed', 'true');

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('link', { name: 'A' })).toBeTruthy();
  });

  it('restores stored expanded sidebar groups', async () => {
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );
    localStorage.setItem('admin-template.sidebar-expanded-groups', JSON.stringify(['Settings']));

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('link', { name: /general settings/i })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /orders/i })).toBeNull();
  });

  it('opens and closes the mobile sidebar from the navbar toggle', async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }));
    expect(screen.getByRole('button', { name: /close sidebar/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /close sidebar/i }));
    expect(screen.queryByRole('button', { name: /close sidebar/i })).toBeNull();

    window.matchMedia = originalMatchMedia;
  });
});
