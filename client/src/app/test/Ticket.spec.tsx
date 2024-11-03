import { fireEvent, screen, waitFor, cleanup } from '@testing-library/react';
import App from '../app';
import { renderWithProviders } from './test-utils';
import { server } from './server';
import { MockTickets, MockUsers } from './mockData';

beforeAll(() => {
  server.listen();
})

beforeEach(() => {
  document.body.appendChild(document.createElement('div')).setAttribute('id', 'portal');
  renderWithProviders(<App />);
})

afterEach(() => {
  const portal = document.getElementById('portal');
  if (portal) {
    portal.remove();
  }
});

test('Create ticket as expected', async () => {
  // Open the "Create an issue" modal
  const createIssueButton = await screen.findByRole('button', { name: /Create an issue/i });
  fireEvent.click(createIssueButton);

  // Check that the form in the modal is displayed
  await screen.findByText('Ticket Create');

  // Fill in the description and submit
  const testDescription = `Test_desc_${Math.floor(1000 + Math.random() * 9000)}`;
  fireEvent.input(screen.getByTestId('text-area-input'), { target: { value: testDescription } });
  fireEvent.click(screen.getByRole('button', { name: 'Create' }));

  // Verify that the ticket with the description appears
  await screen.findByText(testDescription);
});

test('View ticket as expected', async () => {
  // Set up portal div
  const ticketHasAssignee = MockTickets.find(t => t.assigneeId); // note always having ticket

  expect(!!ticketHasAssignee).toBe(true);
  if (!ticketHasAssignee) return;

  // Click on one Ticket
  const ticket = screen.getByText(ticketHasAssignee.description);
  fireEvent.click(ticket);

  // Wait for the modal to open and display the form
  await waitFor(() => expect(screen.getByText(`Ticket-${ticketHasAssignee.id}`)).toBeInTheDocument());

  // Check assignee --- incase having assignee
  // screen.logTestingPlaygroundURL();
  await waitFor(() => expect(screen.getByText(`${MockUsers.find(u => u.id === ticketHasAssignee.assigneeId)?.name}`)).toBeInTheDocument());
});


test('Make ticket complete/in complete as expected', async () => {
  const ticket = MockTickets.find(t => !t.completed); // note always having ticket
  expect(!!ticket).toBe(true);
  if (!ticket) return;

  const ticketElement = screen.getByText(ticket.description);
  fireEvent.click(ticketElement);

  // Check that the form in the modal is displayed
  await screen.findByText(`Ticket-${ticket.id}`);

  const statusDd = document.body.querySelector('#portal .status button[data-testid="dropdown"]');
  expect(!!statusDd).toBe(true);
  if (!statusDd) return;
  fireEvent.click(statusDd);

  const completedOption = document.body.querySelector('.status [data-testid="true"]');
  expect(!!completedOption).toBe(true);
  if (!completedOption) return;
  fireEvent.click(completedOption);
  await waitFor(() => expect(screen.getByText('Updated ticket status!')).toBeInTheDocument());

  // incomplete -> complete
  await waitFor(() => {
    const ticketUpdated = document.body.querySelector(`[data-testid="ticket-${ticket.id}-status-false"]`);
    expect(!!ticketUpdated).toBe(true);
  });

  // FLOW complete -> incomplete
  fireEvent.click(statusDd);
  const inCompleteOption = document.body.querySelector('.status [data-testid="false"]');
  expect(!!inCompleteOption).toBe(true);
  fireEvent.click(completedOption);
  await waitFor(() => expect(screen.getByText('Updated ticket status!')).toBeInTheDocument());
  // complete -> incomplete
  await waitFor(() => {
    const ticketUpdated = document.body.querySelector(`[data-testid="ticket-${ticket.id}-status-true"]`);
    expect(!!ticketUpdated).toBe(true);
  });

  const close = document.body.querySelector(`button[title="Close"]`);
  if (!close) return;
  fireEvent.click(close);
});

test('Assign/UnAssign ticket as expected', async () => {
  const user = MockUsers[2];

  const ticket = MockTickets.find(t => !t.assigneeId); // note always having ticket
  expect(!!ticket).toBe(true);
  if (!ticket) return;

  const ticketElement = screen.getByText(ticket.description);
  fireEvent.click(ticketElement);

  // Check that the form in the modal is displayed
  await screen.findByText(`Ticket-${ticket.id}`);

  const assignDd = document.body.querySelector('#portal .assignee button[data-testid="dropdown"]');
  expect(!!assignDd).toBe(true);
  if (!assignDd) return;
  fireEvent.click(assignDd);

  let assigneeOption = document.body.querySelector(`.assignee [data-testid="${user.id}"]`);
  expect(!!assigneeOption).toBe(true);
  if (!assigneeOption) return;
  fireEvent.click(assigneeOption);

  await waitFor(() => expect(screen.getByText('Updated ticket assignee!')).toBeInTheDocument());

  // assign done
  await waitFor(() => {
    const ticketUpdated = document.body.querySelector(`[data-rfd-draggable-id="issue-${ticket.id}"] [title="${user.name}"]`);
    expect(!!ticketUpdated).toBe(true);
  });

  //FLOW UNASSIGN
  fireEvent.click(assignDd);
  assigneeOption = document.body.querySelector(`.assignee [data-testid="-1"]`);
  expect(!!assigneeOption).toBe(true);
  if (!assigneeOption) return;
  fireEvent.click(assigneeOption);
  await waitFor(() => expect(screen.getByText('Updated ticket remove assignee!')).toBeInTheDocument());
});

