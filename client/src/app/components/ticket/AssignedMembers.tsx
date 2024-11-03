import { User } from '../../api/apiTypes';
import Avatar from '../util/Avatar';
import { memo } from 'react';

interface Props {
  assignee: number | null;
  users: User[] | undefined;
}

const AssignedMembers = (props: Props) => {
  const { users, assignee } = props;
  const membersObj = users?.reduce(
    (p, { id, ...data }) => ({ ...p, [id]: data }),
    {}
  ) as Record<number, User>;

  const u = assignee && membersObj?.[assignee];

  return (
    <div className='ml-7 flex'>
      {u && (
        <Avatar
          key={assignee}
          src={u.profileUrl}
          name={u.name}
          style={{ zIndex: 1 }}
          className='pointer-events-none -ml-2 h-7 w-7 border-2'
        />
      )}
    </div>
  );
};

export default memo(AssignedMembers);
