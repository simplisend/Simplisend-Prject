import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../../../store/actions/rootActions";
import { Translator } from "../../../../../components/utils";

class Logout extends Component {
  logout = () => {
    this.props.history.push("/");
    this.props.updateData("AUTHORIZATION", false);
    this.props.updateData("SET_SA_RIGHT_SIDEBAR_ELEMENT", null);
    this.props.updateData("REMOVE_FORMS", "all");
    this.props.updateData("SA_CATS_RESET") ; 

    localStorage.removeItem("token");
  };

  render = () => {
    return (
      <div className="content-wrapper_1">
        <div className="row_1">
          <div className="column_1">
            <p>
              <Translator string="logoutMessage" />
            </p>
          </div>
        </div>

        <div className="row_end">
          <div className="input-wrapper">
            <button onClick={this.logout} className="form-button">
              <Translator string="logout" />
            </button>
          </div>
        </div>
      </div>
    );
  };
}



const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Logout);
