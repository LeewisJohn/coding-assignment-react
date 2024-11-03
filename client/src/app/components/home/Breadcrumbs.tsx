import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

const Breadcrumbs = () => {
  const location = useLocation();
  const fragments = location.pathname.slice(1).split('/');

  return (
    <div className='mt-8 mb-4 min-w-max px-8 text-c-text sm:px-10 bg-purple-200'>
      <Link to='/' className='hover:underline'>
        Tickets
      </Link>
      {fragments[1] && (
        <>
          <Icon className='mx-2 inline text-xl' icon='ei:chevron-right' />
          <Link to={'/tickets/' + fragments[1]} className='hover:underline'>
            Tickit no {fragments[1]}
          </Link>
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;
