import React from "react";
import { Draggable } from "react-beautiful-dnd";

const DraggableComponent = ({
  draggableId,
  index,
  children,
  isDragDisabled,
  position
}) => {
  const childCount = React.Children.count(children);

  return (
    <div>
      {childCount === 1 && (
        <Draggable
          index={index}
          draggableId={draggableId}
          isDragDisabled={isDragDisabled}
        >
          {(provided, snapshot) => {
            const { isDragging } = snapshot;
            const styl = position
              ? {
                  ...provided.draggableProps.style,
                  opacity: isDragging ? 0.5 : 1,
                  position
                }
              : {
                  ...provided.draggableProps.style,
                  opacity: isDragging ? 0.5 : 1
                };
            return (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={styl}
              >
                {children}
              </div>
            );
          }}
        </Draggable>
      )}
    </div>
  );
};

export default DraggableComponent;
