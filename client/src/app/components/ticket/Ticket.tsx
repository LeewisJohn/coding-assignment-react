import { Ticket as TicketType } from '../../api/apiTypes';
import { selectUsers } from '../../api/endpoints/user.endpoint';
import AssignedMembers from './AssignedMembers';
import { setTicketModalState, setTicketId } from '../../store/slices/ticketSlice';
import { useDispatch } from 'react-redux';
import Tooltip from '../util/Tooltip';

const Ticket = (props: Props) => {
  const { id, assigneeId, description, className, completed } = props;
  const { users } = selectUsers();

  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(setTicketId(id));
    dispatch(setTicketModalState(true))
  }

  return (
    <div className={`${className || ''} h-full`} data-testid={`ticket-${id}-status-${completed}`}>
      <div onClick={onClick} className={`flex flex-col h-full`}>
        <div className='text-xs'>#{id}</div>
        <Tooltip message={description}>
          <span className='line-clamp-2 overflow-hidden text-gray-800'>{description}</span>
        </Tooltip>
        <div className='mt-[10px] flex  justify-between flex-1 items-end'>
          <div className='mb-1 flex items-center gap-3'>
          </div>
          <AssignedMembers assignee={assigneeId} users={users} />
        </div>
      </div>
    </div>
  );
};

export default Ticket;

interface Props extends TicketType {
  className?: string;
}
