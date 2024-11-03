import React, { memo } from 'react';
import { Icon } from '@iconify/react';
import { areEqual, FixedSizeList, ListChildComponentProps } from 'react-window';
import Issue from '../ticket/Ticket';
import DraggableWrapper from '../dnd/DraggableWrapper';
import DroppableWrapper from '../dnd/DroppableWrapper';
import type { Ticket as ApiTicket, List as LIST } from '../../api/apiTypes';

interface Props extends LIST {
  idx: number; // Index of the list
  tickets?: ApiTicket[]; // List of tickets
}

const Row = memo(({ data: items, index, style }: ListChildComponentProps) => {
  const item = items[index];

  if (!item) return null; // Return null for placeholder

  return (
    <DraggableWrapper
      className="hover:bg-c-4 mb-2 w-full rounded-sm bg-c-1 p-2 shadow-issue h-32"
      index={index}
      draggableId={`issue-${item.id}`}
      key={item.id}
      style={style}
    >
      <Issue {...item} />
    </DraggableWrapper>
  );
}, areEqual);

const List: React.FC<Props> = memo(({ name, id, tickets }) => {
  if (!tickets) return null;
  const heightInPixels = window.innerHeight * 0.7;

  return (
    <DroppableWrapper
      droppableId={`list-${id}`}
      type="issue"
      mode="virtual"
      cloneItem={(rubric) => (
        <Issue
          className="hover:bg-c-4 mb-2 w-full rounded-sm bg-c-1 p-2 shadow-issue h-32"
          {...tickets[rubric.source.index]}
        />
      )}
    >
      <div className="relative bg-c-2 p-3 text-c-5 shadow-list">
        <div className="mb-4 flex items-center justify-between text-[15px]">
          <div className="item-center flex">
            <span className="block border-[1.5px] border-transparent pl-2 font-medium">
              {name}
            </span>
            <span className="mx-2 text-gray-500">|</span>
            <span className="text-c-4 pt-[1px] font-bold">{tickets.length}</span>
          </div>
          <div className="flex gap-2">
            <button title="Edit" className="btn-icon hover:bg-c-3">
              <Icon icon="akar-icons:edit" />
            </button>
          </div>
        </div>
        <FixedSizeList
          height={heightInPixels}
          itemCount={tickets.length}
          itemSize={128} // h-32
          width="auto"
          itemData={tickets}
          className="task-list"
        >
          {Row}
        </FixedSizeList>
      </div>
    </DroppableWrapper >
  );
});

export default List;
