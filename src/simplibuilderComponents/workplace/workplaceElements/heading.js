import React, { Component } from "react";
import { updateData } from "../../../store/actions/rootActions";
import { connect } from "react-redux";
import { generateRandromString } from "../../../funcs";
import {
  DroppableComponent,
  Translator,
  DraggableComponent
} from "../../../components/utils";

class Heading extends Component {
  componentWillMount = () => {
    const { droppableId, droppables } = this.props;
    /*
      if this droppable is already registred
      this will happend when user deactivate the workplace button and reactivate it again

    */

    if (!droppables[droppableId]) {
      this.props.updateData(`ADD_DROPPABLE`, { key: droppableId });
    }
  };

  render = () => {
    const {
      droppableId,
      droppables,
      activeWorkPlaceButton,
      isWorkPlaceDraggablesActive
    } = this.props;
    const isDropDisabled =
      activeWorkPlaceButton === "btn-B_TagForm" ? false : true;

    return (
      <DroppableComponent
        droppableId={droppableId}
        draggingColor={"lightblue"}
        isDropDisabled={isDropDisabled}
      >
        {droppables[droppableId] && droppables[droppableId].length === 0 && (
          <div className="dropped_container">
            <h1>
              <Translator string="heading_Text" />
            </h1>
          </div>
        )}

        {droppables[droppableId] &&
          droppables[droppableId].length > 0 &&
          droppables[droppableId].map((item, i) => {
            const draggableId = generateRandromString();
            const Component = this.props.ELEMENTS_MAP[item.type];

            return (
              <DraggableComponent
                draggableId={draggableId}
                index={i}
                key={draggableId}
                isDragDisabled={!isWorkPlaceDraggablesActive}
                position="1"
              >
                <Component
                  {...item}
                  id={item.id}
                  index={i}
                  container={this.props.droppableId}
                />
              </DraggableComponent>
            );
          })}
      </DroppableComponent>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStoreToProps = state => {
  return {
    droppables: state.droppables.droppables,
    /* whether this droppable should be active or not based on the active button in the workplace */
    activeWorkPlaceButton: state.workplace.currentActiveButton,
    isWorkPlaceDraggablesActive: state.droppables.isWorkPlaceDraggablesActive
  };
};

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(Heading);
