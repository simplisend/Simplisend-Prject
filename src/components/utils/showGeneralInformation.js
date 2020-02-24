import React, { Component } from "react";
import { connect } from "react-redux";

/* component to show general discription when user hovers on a question */
class ShowGeneralInformation extends Component {
  render = () => {
    const { activeGeneralDiscription } = this.props;
    if (activeGeneralDiscription) {
      return (
        <div className="general-info">
          {activeGeneralDiscription && <p>{activeGeneralDiscription}</p>}
        </div>
      );
    }
    return null;
  };
}

const mapStateToProps = state => {
  return {
    activeGeneralDiscription: state.activeItems.activeGeneralDiscription
  };
};
export default connect(mapStateToProps)(ShowGeneralInformation);
