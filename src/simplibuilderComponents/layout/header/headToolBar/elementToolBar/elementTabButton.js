import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../../../store/actions/rootActions";
import { Translator } from "../../../../../components/utils";
/*
  button for the toolbar that belongs to the Element tab in the header
  this component will be used in ElementTabToolBar Component (elemenTabToolBar.js)
  which will be used in the toolbar in main.js
*/
class ElementTabButton extends Component {
  /* update the title of side bar */
  updateSideBarTitle = () =>
    this.props.updateData("SIDEBAR_TITLE", this.props.title);

  render = () => {
    const { id, symbol, title } = this.props;
    const currentActive = this.props.active;
    const cls =
      title === currentActive ? "symbol-btn_3 active" : "symbol-btn_3";

    return (
      <button
        id = {id}
        className = {cls}
        onClick={ this.updateSideBarTitle }
      >
        <span className= 'titleText'>{<Translator string={title} />}</span>
        <span className= 'titleSymbol'>{symbol}</span>

      </button>
    );
  };
}

const mapStoreToProps = state => {
  return {
    /* decide which button is active now */
    active: state.sideBar.title
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* update sidebar title */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(ElementTabButton);
