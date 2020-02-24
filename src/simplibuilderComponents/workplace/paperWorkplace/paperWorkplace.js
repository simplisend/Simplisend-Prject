import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import { Block, Grid, Svg } from "../workplaceElements";

/* map each button to the corresponding element */
const ELEMENTS_MAP = {
  block: Block,
  grid: Grid,
  uploadSvg: Svg
};

class PaperWorkplace extends Component {
  render = () => {
    const { droppables, currentActivePage } = this.props;

    let workplaceCls = "";
    let textCls = "";

    if (currentActivePage !== "paperContainer") {
      workplaceCls = "unactive";
      textCls = "unactive-Container";
    }

    return (
      <div>
        {droppables &&
          droppables["paperWorkplaceElements"] &&
          droppables["paperWorkplaceElements"].map((item, i) => {
            if (item.blockType === "paper") {
              const typ = /([a-zA-Z]+)\d+/.exec(item.droppable)[1];
              const Component = ELEMENTS_MAP[typ];

              return (
                <div id="wb_Container_holder" className={workplaceCls} key={i}>
                  <form className={`wp_Element_Container ${textCls}`}>
                    <Component
                      droppableId={item.droppable}
                      key={item.droppable}
                      ELEMENTS_MAP={ELEMENTS_MAP}
                    />
                  </form>
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    /* render workplace elements (heading,ask/answer,info ....)*/
    droppables: state.droppables.droppables,
    /* minpulate styles when this workplace is not active */
    currentActivePage: state.workplace.currentActivePage,
    activeForm: state.saForms.activeForm,
    selectedForm: state.activeItems.selectedForm
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* initiate the formContainer droppable */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(PaperWorkplace);
