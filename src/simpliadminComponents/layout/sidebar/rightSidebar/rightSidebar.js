import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../../store/actions/rootActions";
import RightSidebarButton from "./rightSidebarButton";
import icons from "../../../../configs/icons";

class RightSidebar extends Component {
  /* when clicking on a right sidebar button display the corresponding element */
  setRightSidebarElement = title => {
    this.props.updateData("SET_SA_RIGHT_SIDEBAR_ELEMENT", title);
  };

  render = () => {
    const { buttons } = this.props;
    return (
      <div id="sa-right-sidebar">
        <RightSidebarButton
          key={1}
          symbol={icons.logout}
          title={"logout"}
          action={() => this.setRightSidebarElement('logout') }
        />

        {buttons.map(item => (
          <RightSidebarButton
            key={item.id}
            symbol={item.symbol}
            title={item.title}
            action={() => this.setRightSidebarElement(item.title)}
          />
        ))}
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    buttons: state.saRightSidebar.buttons,
    active: state.saRightSidebar.active
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
)(RightSidebar);
