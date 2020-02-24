import React, { Component } from "react";
import LeftSidebar from "./sidebar/leftSidebar/leftSidebar";
import RightSidebar from "./sidebar/rightSidebar/rightSidebar";
import { Workplace } from "../workplace";

/* wraps start screen and everything between header and footer */
class BodyWrapper extends Component {
  render = () => {
    return (
      <div id="bodyContainer">
        <div id="left" className="sa_Left_sideBarContainer">
          <div
            className="sa_LSB-toggler"
            onClick={() => this.props.updateData("SA-CLASS-TOGGLER")}
          ></div>
          <LeftSidebar />
        </div>

        <Workplace history={this.props.history} />

        <div className="sa_Right_sideBarContainer">
          <RightSidebar />
        </div>
      </div>
    );
  };
}

export default BodyWrapper;
