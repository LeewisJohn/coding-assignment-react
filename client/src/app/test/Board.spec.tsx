import { fireEvent, screen, waitFor } from '@testing-library/react';
import App from '../app';
import { renderWithProviders } from './test-utils';
import { MockTickets } from './mockData';
import { startServer } from './server';

test('All tickets display as expected', async () => {
  await startServer();

  renderWithProviders(<App />);

  // ensure all tickets display
  await waitFor(() => {
    MockTickets.forEach(({ description }) => {
      expect(screen.getByText(description)).toBeInTheDocument();
    })
  });
});

test('Validation that filter works', () => {
  const { container } = renderWithProviders(<App />);

  fireEvent.click(screen.getByRole('button', { name: /select/i }));
  const completedOption = container.querySelector('[data-testid="true"]');
  expect(completedOption).toBeInTheDocument();
  if (completedOption) {
    fireEvent.click(completedOption);
    const filteredTickets = container.querySelectorAll('.item');
    expect(filteredTickets.length).toBe(MockTickets.filter(t => t.completed).length);
  }
});
