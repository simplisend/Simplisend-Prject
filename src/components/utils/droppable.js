import React, { Fragment } from 'react' ;
import { Droppable } from 'react-beautiful-dnd' ;



const DroppableComponent = ({children,droppableId,isDropDisabled,draggingColor}) => {
  if (droppableId === 'formContainer') {

  }
  return (
    <Fragment>
      <Droppable droppableId={droppableId} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => {
          const { isDraggingOver } = snapshot;

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                background:
                  isDraggingOver && draggingColor ? draggingColor : null
              }}
            >
              {children}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </Fragment>
  );
};
//  { provided.placeholder}

export default DroppableComponent;
