import {
  DraggableProvided,
} from "@hello-pangea/dnd";

type DROP = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isDragging?: boolean;
  provided: DraggableProvided;
};

type Style = {
  height: number;
  left: number;
  width: number | string;
  [key: string]: any; // This allows for additional properties
};

type GetStyleParams = {
  draggableStyle: Style;
  virtualStyle: Style;
  isDragging?: boolean;
};

const DraggableItem = ({
  children,
  className,
  style,
  isDragging,
  provided,
}: DROP) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({
        draggableStyle: provided.draggableProps.style as Style,
        virtualStyle: style as Style,
        isDragging,
      })}
      className={`item ${isDragging ? "is-dragging" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default DraggableItem;

function getStyle({
  draggableStyle,
  virtualStyle,
  isDragging,
}: GetStyleParams): Style {
  const combined: Style = {
    ...virtualStyle,
    ...draggableStyle,
  };

  const grid = 8; // mt-8 on ticket

  const result: Style = {
    ...combined,
    height: isDragging ? combined.height : combined.height - grid,
    left: isDragging ? combined.left : combined.left + grid,
    width: isDragging
      ? draggableStyle.width
      : `calc(${combined.width} - ${grid * 2}px)`,
    marginBottom: grid,
  };

  return result;
}
