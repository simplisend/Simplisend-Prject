import React from "react";
import { connect } from "react-redux";

const LeftSidebarItem = ({ symbol, title, text, active, action }) => {
  //const textPadding = active === title ? 15 : 0;
  return (
    <div>
      <div className="sa_sidebarButton" onClick={action}>
        <div className="symbol-btn_4">{symbol}</div>

        <div className="btn-Text">{title}</div>
      </div>
      {active === title && <div className="sidebar-sub-btn"> {text} </div>}
    </div>
  );
};

const mapStoreToProps = state => {
  return {
    active: state.ssLeftSidebar.activeButton
  };
};

export default connect(mapStoreToProps)(LeftSidebarItem);
