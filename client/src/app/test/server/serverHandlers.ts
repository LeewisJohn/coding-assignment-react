import { http, HttpResponse } from 'msw'
import { MockTickets, MockUsers } from '../mockData'

const handlers = [
  http.get("*/api/tickets", () => {
    console.log("MSW get tickets", MockTickets.length);
    return HttpResponse.json(MockTickets);
  }),
  http.post("*/api/tickets", async ({ request }) => {
    const data = await request.json() as any;
    const body = {
      id: MockTickets.length + 1,
      assigneeId: null,
      completed: false,
      ...data
    }
    MockTickets.push(body);
    console.log("MSW create ticket with ", body);
    return HttpResponse.json({});
  }),
  http.get("*/api/users", () => {
    console.log("MSW get tickets", MockUsers.length);
    return HttpResponse.json(MockUsers);
  }),
  // make complete
  http.put('*/api/tickets/:id/complete', async ({ request, params }) => {
    const { id } = params;
    const ticket = MockTickets.find(t => t.id === Number(id));
    if (ticket) {
      ticket.completed = true;
      console.log('Make ticket complete with ID "%s"', id)
      console.log('Tickets', MockTickets)
    }
    return HttpResponse.json({});
  }),
  // make in complete
  http.delete('*/api/tickets/:id/complete', async ({ request, params }) => {
    const { id } = params
    const ticket = MockTickets.find(t => t.id === Number(id));
    if (ticket) {
      ticket.completed = false;
      console.log('Make ticket incomplete with ID "%s"', id)
    }
    return HttpResponse.json({});
  }),
  //
  http.put('*/api/tickets/:ticketId/assign/:userId', async ({ request, params }) => {
    const { userId, ticketId } = params
    const ticket = MockTickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.assigneeId = Number(userId);
      console.log(`Assign ticket with with ID ${ticketId} to User with ID ${userId}`)
    }
    return HttpResponse.json({});
  }),
  http.put('*/api/tickets/:ticketId/unassign', async ({ request, params }) => {
    const { userId, ticketId } = params
    const ticket = MockTickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.assigneeId = null;
      console.log(`UnAssign ticket with with ID ${ticketId}`)
    }
    return HttpResponse.json({});
  }),
]

export { handlers }
