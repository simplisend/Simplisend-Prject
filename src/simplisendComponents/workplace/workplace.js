import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { RightSidebarElementsContainer } from "../layout/sidebar";
import Search from "./search";
import WorkplaceApss from "./workplaceApps";
import Svg from "./../../configs/svg";

/* wraps start screen and everything between header and footer */
class Workplace extends Component {
  render = () => {
    const { activeHeaderButton } = this.props;

    const domain =
      activeHeaderButton === "1" ? "send" : activeHeaderButton.split(";")[1];
    return (
      <div className="ss_WP-Container">
        <div className="workplace-body" />
        <div className="workplace-logo">
          {activeHeaderButton === "1" && (
            <div id="logo_div">
              <span className="simpli-logo">
                impli{Svg.logo}
                <span className="logo-domain">{domain}</span>
              </span>
            </div>
          )}
          {activeHeaderButton !== "1" && (
            <div id="logo_div">
              <span className="simpli-logo-2">
                {domain}
                {Svg.logo}
              </span>
            </div>
          )}

          <div className="workplace-search">
            <Search />
          </div>
        </div>

        <WorkplaceApss history={this.props.history} />

        <div>
          <RightSidebarElementsContainer history={this.props.history} />
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

const mapStateToProps = state => {
  return {
    /* change logo domain */
    activeHeaderButton: state.ssheader.active
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workplace);
