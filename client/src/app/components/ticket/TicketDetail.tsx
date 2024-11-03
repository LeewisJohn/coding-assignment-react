import { Icon } from '@iconify/react';
import { forwardRef, useImperativeHandle, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../store/hooks';
import { useCreateTicketMutation, useUpdateTicketMutation, selectTicket, selectTickets } from '../../api/endpoints/tickets.endpoint';
import { setTicketModalState } from '../../store/slices/ticketSlice';
import DropDown from '../util/DropDown';
import TextareaInput from '../util/TextareaInput';
import WithLabel from '../util/WithLabel';
import Item from '../util/Item';
import showConfirmModal from '../util/ConfirmModel';
import { UNASSIGN, UPDATE_TICKET_TYPE, STATUS } from '../../constants';
import type { Ticket, CreateIssue, UpdateTicketType } from '../../api/apiTypes';
import type { TicketProps } from './TicketHOC';
import Breadcrumbs from '../home/Breadcrumbs';

const TicketDetail = forwardRef((props: TicketProps, ref) => {
  const { users } = props;
  const dispatch = useDispatch();
  const paramsId = Number(useParams()['id']);
  const ticketId = paramsId || useAppSelector(state => state.ticket.id);
  const initialForm: CreateIssue = { description: 'No name' };

  const ticket = ticketId
    ? paramsId
      ? selectTicket(ticketId)?.ticket
      : selectTickets().tickets?.find(t => t.id === ticketId)
    : {};

  const { id, description, assigneeId, completed } = (ticket || {}) as Ticket;
  const [updateTicket] = useUpdateTicketMutation();
  const [createTicket] = useCreateTicketMutation({ fixedCacheKey: 'create' })

  const [form, rDispatch] = useReducer(reducer, initialForm);

  const dispatchMiddleware = async (type: UpdateTicketType, value: any) => {
    if (!id) return;
    const { error } = await updateTicket({ id, body: { type, value } });
    if (!error) toast.success(`Updated ticket ${cipher[type] ?? type}!`);
  };

  const handleClose = () => {
    if (!id && form.description)
      return showConfirmModal({
        confirmText: 'Are you sure you want to disable?',
        btnName: 'Yes',
        onConfirm: () => dispatch(setTicketModalState(false)),
      });
    dispatch(setTicketModalState(false));
  };

  useImperativeHandle(ref, () => ({
    create: async () => {
      const { error } = await createTicket(form);
      if (error) return;
      toast.success('Added ticket!');
      dispatch(setTicketModalState(false));
    },
    close: handleClose,
  }));

  return (
    <div className="flex flex-col">
      {!!paramsId && <Breadcrumbs />}
      <Header id={id} onClose={handleClose} paramsId={paramsId} />
      <div className="sm:flex md:gap-3">
        <DescriptionInput
          description={description}
          onDescriptionChange={(value) => rDispatch({ type: UPDATE_TICKET_TYPE.Desc, value })}
        />
        {id && (
          <TicketSettings
            users={users}
            completed={completed}
            assigneeId={assigneeId}
            onStatusChange={(value) => dispatchMiddleware(UPDATE_TICKET_TYPE.Statue, value)}
            onAssigneeChange={(value) => dispatchMiddleware(
              value === UNASSIGN.value ? UPDATE_TICKET_TYPE.RemoveAssignee : UPDATE_TICKET_TYPE.Assignee,
              value
            )}
          />
        )}
      </div>
    </div>
  );
});

export default TicketDetail;

// Extracted Header component
const Header = ({ id, onClose, paramsId }: { id?: number; onClose: () => void, paramsId?: number }) => (
  <div className="mt-3 flex items-center justify-between text-[16px] text-gray-600 sm:px-3">
    <Item size="h-4 w-4" name={id ? `Ticket-${id}` : 'Ticket Create'} />
    <div className="text-black flex">
      {id && (
        <button title="Delete" className="btn-icon text-xl">
          <Icon icon="bx:trash" />
        </button>
      )}
      {!paramsId && (<button onClick={onClose} title="Close" className="btn-icon ml-4 text-lg">
        <Icon icon="akar-icons:cross" />
      </button>
      )}
    </div>
  </div>
);

// Extracted DescriptionInput component
const DescriptionInput = ({ description, onDescriptionChange }: { description?: string; onDescriptionChange: (value: string) => void }) => (
  <div className="w-full sm:pr-6">
    <TextareaInput
      label="Title"
      onChange={(e) => onDescriptionChange(e.target.value)}
      defaultValue={description}
      className="font-medium sm:text-[22px] sm:font-semibold"
      placeholder="Description"
      maxLength={100}
      required
    />
    <hr className="mx-3" />
  </div>
);

// Extracted TicketSettings component
const TicketSettings = ({
  users,
  completed,
  assigneeId,
  onStatusChange,
  onAssigneeChange,
}: {
  users: any[];
  completed: any;
  assigneeId: any;
  onStatusChange: (value: any) => void;
  onAssigneeChange: (value: any) => void;
}) => (
  <div className="mt-3 shrink-0 sm:w-[15rem]">
    <WithLabel label="Status">
      <DropDown
        className="status"
        list={STATUS}
        defaultValue={completed}
        variant="small"
        onChange={(option: any) => onStatusChange(option.value)}
      />
    </WithLabel>
    <WithLabel label="Assignee">
      <DropDown
        className="assignee"
        list={users}
        defaultValue={assigneeId}
        variant="small"
        onChange={(option: any) => onAssigneeChange(option.value)}
      />
    </WithLabel>
    <hr className="border-t-[.5px] border-gray-400" />
  </div>
);

const cipher: Record<string, string> = {
  description: UPDATE_TICKET_TYPE.Desc,
  status: UPDATE_TICKET_TYPE.Statue,
};

const reducer = (state: CreateIssue, { type, value }: { type: string; value: any }): CreateIssue => ({
  ...state,
  [type]: value,
});
