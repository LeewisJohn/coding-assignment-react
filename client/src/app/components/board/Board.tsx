import React, { lazy, Suspense as S, useEffect, useMemo, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import DroppableWrapper from '../dnd/DroppableWrapper';
import List from '../list/List';
import { useTicketsQuery, useUpdateTicketMutation } from '../../api/endpoints/tickets.endpoint';
import type { Ticket } from '../../api/apiTypes';
import { STATUS, UPDATE_TICKET_TYPE } from '../../constants';
import SS from '../util/SpinningCircle';
import DropDown from '../util/DropDown';
import { useDispatch } from 'react-redux';
import { setTicketId, setTicketModalState } from '../../store/slices/ticketSlice';
import { useAppSelector } from '../../store/hooks';
import toast from 'react-hot-toast';

const TicketHOC = lazy(() => import('../ticket/TicketHOC'));

interface Status {
  id: number;
  value: boolean;
  name: string,
}

interface FiltersProps {
  status: Status[];
  setStatus: React.Dispatch<React.SetStateAction<Status[]>>;
}

interface ContentProps {
  tickets?: Ticket[];
  status: Status[];
  ticketError?: any;
  isLoading: boolean;
}

const Board: React.FC & {
  Header: React.FC;
  Filters: React.FC<FiltersProps>;
  Content: React.FC<ContentProps>;
  Modal: React.FC;
} = () => {
  const [status, setStatus] = useState<Status[]>(STATUS);
  const { data: tickets, error: ticketError, isLoading } = useTicketsQuery();

  return (
    <div className="mt-6 flex grow flex-col px-3 sm:px-10 gap-3 m-auto max-w-4xl">
      <Board.Header />
      <Board.Filters status={status} setStatus={setStatus} />
      <Board.Content tickets={tickets} isLoading={isLoading} status={status} ticketError={ticketError} />
      <Board.Modal />
    </div>
  );
};

Board.Header = () => (
  <h1 className="mb-4 text-xl font-semibold text-c-text">Ticket Board</h1>
);

Board.Filters = ({ setStatus }: FiltersProps) => {
  const dispatch = useDispatch();

  const handleStatusChange = (selectedOptions: { value: boolean }[]) => {
    const selectedValues = selectedOptions.map(option => option.value);
    const updatedStatus = STATUS.filter(s => selectedOptions.length === 0 || selectedValues.includes(s.value));
    setStatus(updatedStatus);
  };

  const handleCreateIssueClick = () => {
    dispatch(setTicketId(null));
    dispatch(setTicketModalState(true));
  };

  return (
    <div className="flex">
      <DropDown
        className="min-w-36"
        list={STATUS}
        type="multiple"
        onChange={handleStatusChange as any}
      />
      <button onClick={handleCreateIssueClick} className="btn peer relative mx-5 shrink-0">
        Create an issue
      </button>
    </div>
  );
};

Board.Content = ({ tickets: initialTickets, status, ticketError, isLoading }: ContentProps) => {
  const [updateTicket, { error }] = useUpdateTicketMutation();
  const isTicketModalOpen = useAppSelector((state) => state.ticket.isTicketModalOpen);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets || []);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('ticketOrder') || '[]');

    const orderedTickets = [...initialTickets || []].sort((a, b) => storedOrder.indexOf(a.id) - storedOrder.indexOf(b.id));

    if (
      isTicketModalOpen ||
      tickets.length === 0 ||
      tickets.filter(x => x.completed).length === orderedTickets.filter(x => x.completed).length ||
      error
    )
      setTickets(orderedTickets);
  }, [initialTickets, error]);

  const onDragEnd = async ({ draggableId, source, destination }: DropResult) => {
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

    const ticketId = parseInt(draggableId.match(/\d+/)?.[0] || '', 10);
    if (!ticketId) return;

    const uncompletedTickets = tickets.filter(ticket => !ticket.completed);
    const completedTickets = tickets.filter(ticket => ticket.completed);

    const sourceList = source.droppableId === "list-1" ? uncompletedTickets : completedTickets;
    const destinationList = destination.droppableId === "list-1" ? uncompletedTickets : completedTickets;

    const [movedTicket] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, { ...movedTicket, completed: destination.droppableId === "list-2" });

    const updatedTickets = [...uncompletedTickets, ...completedTickets];
    setTickets(updatedTickets);
    localStorage.setItem('ticketOrder', JSON.stringify(updatedTickets.map(ticket => ticket.id)));

    const { error: errorLastest } = await updateTicket({
      id: ticketId,
      body: { type: UPDATE_TICKET_TYPE.Statue, value: destination.droppableId === "list-2" },
    });

    !errorLastest && toast.success('Updated ticket!');
  };

  const filteredTickets = useMemo(() => {
    return status.map(({ value, id, name }) => ({
      id,
      name,
      tickets: tickets.filter(ticket => ticket.completed === value) || [],
    }));
  }, [tickets, status]);

  if (isLoading)
    return (<div className="grid h-[40vh] w-full place-items-center">
      <SS />
    </div>)

  return tickets && (
    <div className="mb-5">
      <DragDropContext onDragEnd={onDragEnd}>
        <DroppableWrapper
          type="list"
          className="grid grid-cols-2 gap-3"
          droppableId="board-central"
          direction="horizontal"
        >
          {filteredTickets.map(({ id, ...res }, i) => (
            <List
              key={id}
              id={id}
              idx={i}
              {...res}
            />
          ))}
        </DroppableWrapper>
      </DragDropContext>
    </div>
  )
};

Board.Modal = () => {
  const isOpen = useAppSelector(state => state.ticket.isTicketModalOpen);

  return isOpen ? (
    <S>
      <TicketHOC isModal={true} />
    </S>
  ) : null;
};

export default Board;

