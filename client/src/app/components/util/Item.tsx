interface Props {
  name: string;
  icon?: string;
  size: string;
  variant?: 'ROUND' | 'SQUARE';
  value?: any;
}

const Item = (props: Props) => {
  const { name, icon, size, variant = 'SQUARE', value } = props;

  return (
    <div className={`flex items-center truncate font-normal ${value === -1 ? 'text-red-500' : ''}`}>
      {icon !== undefined &&
        (icon ? (
          <img
            src={icon}
            alt={name}
            className={`mr-4 ${size} ${variant === 'ROUND' ? 'rounded-full object-cover' : ''}`}
          />
        ) : (
          <div
            className={`mr-4 grid place-items-center rounded-full bg-amber-800 ${size}`}
          >
            {name.slice(0, 1).toUpperCase()}
          </div>
        ))}
      {name}
    </div>
  );
};

export default Item;
