import { UPDATE_TICKET_TYPE } from "../constants";

export interface List {
  id: number;
  name: string;
}

export interface Ticket {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean;
}

export interface User {
  id: number;
  name: string;
  profileUrl: string;
  email: string;
}

export interface CreateIssue {
  description: string;
}

export type UpdateTicketType = typeof UPDATE_TICKET_TYPE[keyof typeof UPDATE_TICKET_TYPE];

export interface UpdateIssue {
  id: number;
  body: {
    type: UpdateTicketType;
    value: any;
  };
}

export interface DeleteIssue {
  issueId: number;
  projectId: number;
}

export interface TicketQuery {
  ticketId: number;
  userId?: number;
}
