import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';

import App from './app';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState({}, '', '/');
  });

  afterEach(() => {
    cleanup();
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

    fireEvent.click(screen.getAllByRole('button', { name: /toggle sidebar/i })[0]);
    expect(screen.getByRole('button', { name: /close sidebar/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /close sidebar/i }));
    expect(screen.queryByRole('button', { name: /close sidebar/i })).toBeNull();

    window.matchMedia = originalMatchMedia;
  });

  it('opens the profile settings tab from the account menu', async () => {
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.click(screen.getAllByRole('button', { name: /demo@example.com/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /profile/i })[0]);

    expect(screen.getByRole('heading', { name: /settings/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /personal information/i })).toBeTruthy();
  });

  it('opens the requested settings tab from the URL', async () => {
    window.history.pushState({}, '', '/settings?tab=preferences');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('heading', { name: /settings/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /backup frequency/i })).toBeTruthy();
  });

  it('shows the access control page for an owner session', async () => {
    window.history.pushState({}, '', '/access-control');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'owner@example.com', loginAt: '2026-03-22T00:00:00.000Z', role: 'Owner' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('heading', { name: /access control/i })).toBeTruthy();
    expect(screen.getByText(/save access policies/i)).toBeTruthy();
  });

  it('opens the command palette from the keyboard shortcut and navigates to settings', async () => {
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'owner@example.com', loginAt: '2026-03-22T00:00:00.000Z', role: 'Owner' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText(/search pages, actions, and shortcuts/i), {
      target: { value: 'organization settings' },
    });
    fireEvent.click(screen.getByRole('button', { name: /open organization settings/i }));

    expect(screen.getByRole('heading', { name: /settings/i })).toBeTruthy();
    expect(screen.getByRole('heading', { name: /organization profile/i })).toBeTruthy();
  });

  it('filters command palette items by role permissions', async () => {
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'support@example.com', loginAt: '2026-03-22T00:00:00.000Z', role: 'Support' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.click(screen.getAllByRole('button', { name: /open command palette/i })[0]);
    expect(screen.getByRole('dialog', { name: /command palette/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /open access control/i })).toBeNull();
    expect(screen.getByRole('button', { name: /open support tickets/i })).toBeTruthy();
  });

  it('blocks restricted routes and hides sensitive navigation for support users', async () => {
    window.history.pushState({}, '', '/api-keys');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'support@example.com', loginAt: '2026-03-22T00:00:00.000Z', role: 'Support' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole('heading', { name: /access denied/i })).toBeTruthy();
    expect(screen.queryByRole('link', { name: /api keys/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /access control/i })).toBeNull();
  });

  it('persists profile settings after saving changes', async () => {
    window.history.pushState({}, '', '/settings');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.change(screen.getByDisplayValue('John'), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    cleanup();
    window.history.pushState({}, '', '/settings');
    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByDisplayValue('Jane')).toBeTruthy();
  });

  it('persists app preferences when changed', async () => {
    window.history.pushState({}, '', '/settings?tab=preferences');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'daily' } });

    cleanup();
    window.history.pushState({}, '', '/settings?tab=preferences');
    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe('daily');
  });

  it('persists organization workspace settings when changed', async () => {
    window.history.pushState({}, '', '/settings?tab=organization');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    fireEvent.change(screen.getByDisplayValue('Tech Corp'), { target: { value: 'Northwind Labs' } });
    fireEvent.change(screen.getByDisplayValue('tech-corp'), { target: { value: 'Northwind Labs' } });

    cleanup();
    window.history.pushState({}, '', '/settings?tab=organization');
    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByDisplayValue('Northwind Labs')).toBeTruthy();
    expect(screen.getByDisplayValue('northwind-labs')).toBeTruthy();
    expect(screen.getByText(/northwind-labs.admin.local/i)).toBeTruthy();
  });

  it('resets stored settings back to defaults after confirmation', async () => {
    window.history.pushState({}, '', '/settings?tab=preferences');
    localStorage.setItem(
      'admin-template.persisted-session',
      JSON.stringify({ email: 'demo@example.com', loginAt: '2026-03-22T00:00:00.000Z' })
    );
    localStorage.setItem(
      'admin-template.settings',
      JSON.stringify({
        profile: { firstName: 'Jane' },
        app: { backupFrequency: 'daily', analyticsTracking: false },
      })
    );

    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe('daily');

    fireEvent.click(screen.getByRole('button', { name: /reset settings/i }));
    const resetButtons = screen.getAllByRole('button', { name: /reset settings/i });
    fireEvent.click(resetButtons[resetButtons.length - 1]);

    expect(screen.getByText(/settings reset to defaults/i)).toBeTruthy();
    expect(screen.getByRole<HTMLSelectElement>('combobox').value).toBe('weekly');

    cleanup();
    window.history.pushState({}, '', '/settings');
    render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 120));
    });

    expect(screen.getByDisplayValue('John')).toBeTruthy();
  });
});
