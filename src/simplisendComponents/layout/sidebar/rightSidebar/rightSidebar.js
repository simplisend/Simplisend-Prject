import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../../store/actions/rootActions";
import RightSidebarButton from "./rightSidebarButton";
import { translator } from "../../../../funcs";
import titles from "../../../../configs/title";

class RightSidebar extends Component {
  /* when clicking on a right sidebar button display the corresponding element */
  setRightSidebarElement = title => {
    /* for login\nregister title */
    const titleParts = title.split("_");
    this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", titleParts[0]);
  };

  render = () => {
    const { buttons, language } = this.props;

    return (
      <div id="ss-right-sidebar">
        {buttons.map(item => {
          return (
            <RightSidebarButton
              key={item.id}
              symbol={item.symbol}
              title={translator(item.title, titles[language])}
              action={() => this.setRightSidebarElement(item.title)}
              type={item.type}
            />
          );
        })}
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    buttons: state.ssRightSidebar.buttons,
    active: state.ssRightSidebar.active,
    language: state.lang.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(RightSidebar);
