import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /lignano guest planner/i })).toBeInTheDocument();
  });

  it('renders the disabled generate button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /generate itinerary/i });
    expect(button).toBeDisabled();
  });

  it('renders the itinerary placeholder text', () => {
    render(<App />);
    expect(screen.getByText(/your itinerary preview will appear here/i)).toBeInTheDocument();
  });
});
