import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import Item from './Item';

export type Category<T = number> = { name: string; icon?: string; value: T };

type Prop<T> = {
  list: Category<T>[];
  type?: 'normal' | 'multiple';
  variant?: 'normal' | 'small';
  defaultValue?: T | T[];
  className?: string;
  canSearch?: boolean;
  onChange?: (option: Category<T> | Category<T>[]) => void;
};

function DropDown<T>(props: Prop<T>) {
  const {
    list,
    defaultValue: dv,
    type = 'normal',
    variant = 'normal',
    className,
    canSearch = false,
    onChange = () => { },
  } = props;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMulti = type === 'multiple';

  const initialCurrent = isMulti ?
    (Array.isArray(dv) ? list.filter(item => dv.includes(item.value)) : [])
    : list.find(item => item.value === dv) || null;

  const [current, setCurrent] = useState<Category<T>[] | Category<T> | null>(initialCurrent);
  const [localList, setLocalList] = useState<Category<T>[]>([...list]);
  const [isOpen, setIsOpen] = useState(false);

  // Synchronize value with dv when dv changes
  useEffect(() => {
    setCurrent(current || initialCurrent);
  }, [list, dv]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (idx: number) => {
    if (isMulti && Array.isArray(current)) {
      const [updatedList, selectedItems] = modifyItems(idx, localList, current);
      setLocalList(updatedList);
      if (JSON.stringify(current) !== JSON.stringify(selectedItems)) {
        setCurrent(selectedItems);
        onChange(selectedItems);
      }
    } else {
      const selectedItem = list[idx];
      if (JSON.stringify(current) !== JSON.stringify(selectedItem)) {
        setCurrent(selectedItem);
        onChange(selectedItem);
      }
    }
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement>, idx: number) => {
    e.stopPropagation();
    if (isMulti && Array.isArray(current)) {
      const [updatedItems, selectedItems] = modifyItems(idx, current, localList);
      setLocalList(selectedItems);
      setCurrent(updatedItems);
      onChange(updatedItems);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative text-[15px] font-medium text-black ${variant === 'normal' ? '' : 'mb-8'} ${className}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        data-testid='dropdown'
        className={`flex items-center justify-between border-gray-300 bg-[#edf2f7] px-4 py-1 tracking-wide hover:bg-[#e2e8f0] ${variant === 'normal' ? 'rounded-[4px] border-[1px]' : 'rounded-sm border-none'} ${className ?? 'w-full sm:max-w-fit'}`}
      >
        <div className='flex flex-wrap gap-2'>
          {isMulti && Array.isArray(current) ? (
            current.length ? (
              current.map((item, i) => (
                <div
                  key={(item as Category<T>).value as React.Key}
                  className='flex items-center gap-2 border-[1.5px] border-blue-500 px-2 hover:border-green-500'
                  onClick={(e) => handleDelete(e, i)}
                >
                  <Item size='h-5 w-5' variant='ROUND' {...item} />
                  <Icon className='text-black' icon='akar-icons:cross' />
                </div>
              ))
            ) : (
              <>Select</>
            )
          ) : (
            current ? (
              <Item size='h-4 w-4' {...(current as Category<T>)} />
            ) : (
              <>Select</>
            )
          )}
        </div>
        <Icon
          className={`ml-3 ${variant === 'normal' ? '' : 'text-[12px]'}`}
          icon='la:angle-down'
        />
      </button>
      {isOpen && (
        <ul className='absolute bottom-0 z-10 w-full translate-y-[calc(100%+5px)] rounded-[3px] bg-white py-2 shadow-md'>
          {localList.length ? (
            localList.map((item, idx) => (
              <li
                className={`cursor-pointer px-4 py-2 hover:bg-[#e2e8f0]`}
                onClick={() => handleSelect(idx)}
                key={item.value as React.Key}
                data-testid={item.value}
              >
                <Item
                  size={isMulti ? 'w-6 h-6' : 'w-4 h-4'}
                  variant={isMulti ? 'ROUND' : 'SQUARE'}
                  {...item}
                />
              </li>
            ))
          ) : (
            <span className='my-2 block text-center'>no member left</span>
          )}
        </ul>
      )}
    </div>
  );
}

export default DropDown;

// Helper Functions
const modifyItems = <T,>(idx: number, source: Category<T>[], target: Category<T>[]) => {
  const updatedSource = [...source];
  const [deletedItem] = updatedSource.splice(idx, 1);
  return [updatedSource, [...target, deletedItem]];
};
