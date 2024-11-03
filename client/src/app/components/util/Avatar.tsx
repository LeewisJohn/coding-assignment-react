interface Props {
  src?: string;
  name: string;
  title?: string;
  className?: string;
  onClick?: () => void;
  style?: {};
}

// fake data
const storedUsers: any = {
  'Alice': 'bg-green-300',
  'Bob': 'bg-yellow-300',
  'Chris': 'bg-sky-300',
  'Daisy': 'bg-violet-300',
  'Ed': 'bg-pink-300',
};

function Avatar(props: Props) {
  const { src, name, title, className, onClick, style } = props;
  return (
    <div
      className={`relative grid shrink-0 cursor-pointer place-items-center overflow-hidden rounded-full ${storedUsers[name]} ${className ?? 'h-8 w-8 border-[1px]'
        }`}
      title={title ?? name}
      {...{ style, onClick }}
    >
      <div>{name.at(0)}</div>
      {/* IntersectionObserver - lazyLoad */}
      {src && <img src={src} alt={name} className='absolute block h-full w-full object-cover' />}
    </div>
  );
}

export default Avatar;
