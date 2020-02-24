import React, { Component } from "react";
import SideBarButton from "./sideBarButton";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import ElementTabButton from "../header/headToolBar/elementToolBar/elementTabButton";
import icons from "../../../configs/icons";
import {
  DraggableComponent,
  DroppableComponent,
  Translator
} from "../../../components/utils";

/*
  left side bar
  taskes buttons and title as parameters and redner the buttons
*/

class SideBar extends Component {
  state = {
    buttons:
      this.props.title && this.props.block
        ? this.props.buttons[this.props.title][this.props.block]
        : []
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    return {
      buttons:
        nextProps.title && nextProps.block
          ? nextProps.buttons[nextProps.title][nextProps.block]
          : []
    };
  };

  handleContainerFormButtonClick = name => {
    const typ = name.toUpperCase();
    /* add element to workPlacePageReducer */
    this.props.updateData(typ, null);
  };

  render = () => {
    const { title, block } = this.props;
    const { buttons } = this.state;

    if (title) {
      return (
        <div>
          <div className="sB_Titel">
            <Translator string={title} />
          </div>

          <DroppableComponent
            isDropDisabled={true}
            droppableId={block ? block : "x"}
          >
            {buttons.map((button, i) => {
              if (title === "element") {
                return (
                  <DraggableComponent
                    draggableId={i.toString()}
                    index={i}
                    key={i}
                  >
                    <SideBarButton
                      icon={button.icon}
                      id={i}
                      title={button.title}
                      type={button.type}
                    />
                  </DraggableComponent>
                );
              }

              return (
                <SideBarButton
                  key={i}
                  icon={button.icon}
                  id={i}
                  title={button.title}
                  action={() =>
                    this.handleContainerFormButtonClick(button.title)
                  }
                  type={button.type}
                />
              );
            })}
          </DroppableComponent>
        </div>
      );
    } else {
      return (
        <div>
          <ElementTabButton
            id="btn-Container"
            title="container"
            symbol={icons.container}
          />
          <ElementTabButton
            id="btn-Element"
            title="element"
            symbol={icons.element}
          />
          <ElementTabButton
            id="btn-Library"
            title="library"
            symbol={icons.library}
          />
          <ElementTabButton
            id="btn-Property"
            title="property"
            symbol={icons.property}
          />
          <ElementTabButton
            id="btn-Condition"
            title="condition"
            symbol={icons.condition}
          />
        </div>
      );
    }
  };
}

const mapStoreToProps = state => {
  return {
    buttons: state.sideBar.buttons /* all available buttons */,
    title: state.sideBar.title /* get title */,
    block: state.sideBar.block /* whick block to activate */,
    droppables: state.droppables.droppables
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(SideBar);
