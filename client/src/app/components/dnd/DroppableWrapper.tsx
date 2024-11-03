import {
  Direction,
  Droppable,
} from "@hello-pangea/dnd";
import DraggableItem from "./DraggableItem";

type DROP = {
  children: React.ReactNode;
  cloneItem?: (rubric: any) => React.ReactNode;
  className?: string;
  droppableId: string;
  type: string;
  direction?: Direction;
  mode?: "standard" | "virtual";
};

const DroppableWrapper = ({
  children: CH,
  cloneItem,
  className,
  droppableId,
  type,
  direction,
  mode = "standard",
}: DROP) => {
  return (
    <Droppable
      direction={direction}
      type={type}
      droppableId={droppableId}
      mode={mode}
      renderClone={
        mode === "virtual"
          ? (provided, snapshot, rubric) => (
            <DraggableItem
              provided={provided}
              isDragging={snapshot.isDragging}
            >
              {cloneItem?.(rubric)}
            </DraggableItem>
          )
          : undefined
      }
    >
      {(provided) => (
        <div
          className={className}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {CH}
          {/* {provided.placeholder} */}
        </div>
      )}
    </Droppable>
  );
};

export default DroppableWrapper;
