import { FC, lazy, useRef } from 'react';
import { selectUsers } from '../../api/endpoints/user.endpoint';
import { Category } from '../util/DropDown';
import { UNASSIGN } from '../../constants';
import { Ticket } from '../../api/apiTypes';
import Model from '../util/Model';
import { useAppSelector } from '../../store/hooks';
import { useCreateTicketMutation } from '../../api/endpoints/tickets.endpoint';

const TicketDetail = lazy(() => import('./TicketDetail'));

interface Props {
  children?: FC<TicketProps>;
  isModal?: boolean;
}

const TicketHOC: FC<Props> = ({ children: Component = TicketDetail, isModal, ...props }) => {
  const { users: apiMembers } = selectUsers();
  const ticketId = useAppSelector((state) => state.ticket.id);
  const [, { isLoading }] = useCreateTicketMutation({ fixedCacheKey: 'create' });

  const childRef = useRef<{
    create: () => Promise<void>;
    close: () => void;
  } | null>(null);

  const users: Category[] = apiMembers
    ? [UNASSIGN, ...apiMembers.map(({ name, profileUrl, id }) => ({
      name,
      icon: profileUrl,
      value: id,
    }))]
    : [];

  const C = <Component users={users} ref={childRef}  {...props} />;

  return isModal ? (
    <Model
      {...props}
      isLoading={isLoading}
      isForm={!ticketId}
      onClose={() => childRef.current?.close()}
      onSubmit={() => childRef.current?.create() || Promise.resolve()}
      className='max-w-[65rem]'>
      {C}
    </Model>
  ) : C;
};

export default TicketHOC;

export interface TicketProps {
  ticket?: Ticket;
  users: Category[];
  isModal?: boolean;
  isLoading?: boolean;
}
