import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { RightSidebarElementsContainer } from "../layout/sidebar";
import CategroriesTree from "./categoriesTree";

/* wraps start screen and everything between header and footer */
class Workplace extends Component {
  render = () => {
    
    return (
      <div className="sa_WP-Container">
        <CategroriesTree />

        <div>
          <RightSidebarElementsContainer history = {this.props.history}/>
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    /*
      set right sidebar element
      and hide right sidebar element
    */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Workplace);
