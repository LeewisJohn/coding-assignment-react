import toast from 'react-hot-toast';
import { UPDATE_TICKET_TYPE } from '../../constants';
import { api } from '../api';
import type {
  CreateIssue,
  Ticket,
  UpdateIssue,
} from '../apiTypes';

// https://redux-toolkit.js.org/rtk-query/usage/mutations#shared-mutation-results
export const extendedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    tickets: builder.query<Ticket[], void>({
      query: () => ({
        url: `tickets`,
      }),
      // keepUnusedDataFor: 300, // 5 phút
      providesTags: ['Ticket'],
    }),
    ticket: builder.query<Ticket, number>({
      query: (id) => ({
        url: `tickets/${id}`,
      }),
      providesTags: ['Ticket'],
    }),
    createTicket: builder.mutation<void, CreateIssue>({
      query: (body) => ({ url: 'tickets', method: 'POST', body }),
      invalidatesTags: ['Ticket'],
    }),
    updateTicket: builder.mutation<void, UpdateIssue>({
      query: ({ id, body: { type, value } }) => {
        let url = `tickets/${id}`;
        let method: 'PUT' | 'DELETE' = 'PUT';
        let body: any = {};
        // Determine API endpoint and HTTP method based on `type`
        switch (type) {
          case UPDATE_TICKET_TYPE.Statue:
            url += '/complete';
            method = value ? 'PUT' : 'DELETE';
            break;
          case UPDATE_TICKET_TYPE.Assignee:
            url += `/assign/${value}`;
            break;
          case UPDATE_TICKET_TYPE.RemoveAssignee:
            url += '/unassign';
            break;
        }

        return {
          url,
          method,
          body,
        };
      },
      invalidatesTags: ['Ticket'],
    }),
  }),
  overrideExisting: false,
});

// hooks
export const {
  useTicketsQuery,
  useTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
} = extendedApi;

// selector
export const selectTickets = () =>
  extendedApi.useTicketsQuery(undefined, {
    selectFromResult: ({ data }) => ({ tickets: data }),
  });

// selectors
export const selectTicket = (id: number) =>
  extendedApi.useTicketQuery(id, {
    selectFromResult: ({ data }) => ({ ticket: data }),
  });

