import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import generateRandromString from "../../funcs/generateRandromString";

class WorkPlacePage extends Component {
  /*
    when new item (heading , askAnswer , Information) is added to the form workplace
    then add new workplace element (heading , askAnswer , Information) as droppable in the workplaceELements
    droppable (droppable in the right side-bar )
  */

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.form.length !== prevProps.form.length) {
      const { form, droppables } = this.props;
      const formLength = form.length;

      const type = form[formLength - 1].type;
      const drop = type + generateRandromString();
      const drag = "workplaceDraggable" + generateRandromString();
      const blockType = form[formLength - 1]["blockType"];
      const column = this.props.droppables["formWorkplaceElements"]
        ? this.props.droppables["formWorkplaceElements"]
        : [];
      const newItem = {
        droppable: drop,
        draggable: drag,
        type,
        blockType,
        id: droppables["formWorkplaceElements"]
          ? droppables["formWorkplaceElements"].length + 1
          : 1
      };
      const columnUpdated = [...column, newItem];
      this.props.updateData("ADD_ELEMENT_TO_DROPPABLE", {
        key: "formWorkplaceElements",
        column: columnUpdated
      });
      return;
    }

    if (this.props.paper.length !== prevProps.paper.length) {
      const { paper, droppables } = this.props;
      const paperLength = paper.length;

      const type = paper[paperLength - 1].type;
      const blockType = paper[paperLength - 1]["blockType"];
      const drop = type + generateRandromString();
      const drag = "workplaceDraggable" + generateRandromString();
      const column = this.props.droppables["paperWorkplaceElements"]
        ? this.props.droppables["paperWorkplaceElements"]
        : [];
      const newItem = {
        droppable: drop,
        draggable: drag,
        type,
        blockType,
        id: droppables["paperWorkplaceElements"]
          ? droppables["paperWorkplaceElements"].length + 1
          : 1
      };
      const columnUpdated = [...column, newItem];
      this.props.updateData("ADD_ELEMENT_TO_DROPPABLE", {
        key: "paperWorkplaceElements",
        column: columnUpdated
      });
      return;
    }
  };

  render = () => {
    const { cls, id, zIndex, name, left, right, children } = this.props;

    return (
      <div
        name={name}
        className={cls}
        id={id}
        style={{ display: "inline-block", left, right, zIndex }}
      >
        {children}
      </div>
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
    /* add new WorkPlacePageContentContainer upon each form append operation*/
    form: state.workPlacePage.form,
    paper: state.workPlacePage.paper,

    /* register work place page as a droppable */
    droppables: state.droppables.droppables
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(WorkPlacePage);
