import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Filter,
  LoginForm,
  RegisterForm,
  Mail,
  Settings
} from "./rightSidebarElements";
import { Logout } from "../../../../simpliadminComponents/layout/sidebar/rightSidebar/rightSidebarElements";
import {
  ShowGeneralInformation,
  ClickOutsideComponent
} from "../../../../components/utils";
import { updateData } from "../../../../store/actions/rootActions";
import svg from "../../../../configs/svg";

const ELEMENTS_MAP = {
  filter: Filter,
  login: LoginForm,
  register: RegisterForm,
  mail: Mail,
  settings: Settings,
  library: Settings
};

class RightSidebarElementsContainer extends Component {
  render = () => {
    const { element, activeGeneralDiscription } = this.props;
    let Component = ELEMENTS_MAP[element];

    /* if user logged in then show the logout button */
    if (element === "login" && this.props.isAuthorized) {
      Component = Logout;
    }

    return (
      <div className="right-sidebar-elements-container">
        <div className="eule">{svg.eule}</div>
        {activeGeneralDiscription && (
          <div className="discription">
            <ClickOutsideComponent
              condition={activeGeneralDiscription !== null}
              handleClick={() =>
                this.props.updateData("SET_ACTIVE_ITEM", {
                  key: "activeGeneralDiscription",
                  item: null
                })
              }
            >
              <ShowGeneralInformation />
            </ClickOutsideComponent>
          </div>
        )}

        {Component && (
          <ClickOutsideComponent
            condition={element !== null}
            handleClick={() =>
              this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", null)
            }
          >
            <Component history={this.props.history} />
          </ClickOutsideComponent>
        )}
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    element: state.ssRightSidebar.element,
    isAuthorized: state.auth.isAuthorized,
    activeGeneralDiscription: state.activeItems.activeGeneralDiscription
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(RightSidebarElementsContainer);
