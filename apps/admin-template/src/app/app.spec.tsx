import { act, render, screen } from '@testing-library/react';

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

    expect(screen.getByText(/dashboard/i)).toBeTruthy();
    expect(screen.getByText(/demo@example.com/i)).toBeTruthy();
  });
});
