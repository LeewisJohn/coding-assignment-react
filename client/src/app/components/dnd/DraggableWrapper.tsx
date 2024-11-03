import { Draggable } from "@hello-pangea/dnd";
import DraggableItem from "./DraggableItem";

type DROP = {
  children: React.ReactNode;
  className?: string;
  draggableId: string;
  index: number;
  style?: React.CSSProperties;
  key: string;
};

const DraggableWrapper = (props: DROP) => {
  const { index, draggableId, className, style, children } = props;

  return (
    <Draggable draggableId={draggableId} index={index}>
      {provided =>
        <DraggableItem
          provided={provided}
          style={style}
          className={className}
        >
          {children}
        </DraggableItem>
      }
    </Draggable>
  );
};

export default DraggableWrapper;
