import React, { Component } from "react";
import { connect } from "react-redux";
import { ElementTabToolBar } from "./headToolBar/elementToolBar";
import { FormTabToolBar } from "./headToolBar/formToolBar";
import { StyleTabToolBar } from "./headToolBar/styleToolBar";

class ToolBar extends Component {
  render = () => {
    const mapHeaderLinkToComponent = {
      form: FormTabToolBar,
      element: ElementTabToolBar,
      style: StyleTabToolBar
    };

    const ToolbarComponent = mapHeaderLinkToComponent[this.props.headerActive];
    return (
      <div id="headerToolBarContainer">
        <div id="toolBarWrapper">
          <ToolbarComponent />
        </div>
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    /* decide which component should be rendered based on mapHeaderLinkToComponent */
    headerActive: state.header.active
  };
};

export default connect(mapStoreToProps)(ToolBar);
