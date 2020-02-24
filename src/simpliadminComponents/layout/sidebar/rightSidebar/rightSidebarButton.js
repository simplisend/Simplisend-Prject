import React from "react";
import { connect } from "react-redux";

const RightSidebarButton = ({ title, symbol, action, element }) => {
  let cls = "";
  const titleParts = title.split("\n");

  if (element === titleParts[0]) {
    const clas = titleParts[0] === "logout" ? "active_1" : "active_2";
    cls += ` ${clas}`;
  }

  return (
    <div onClick={action}>
      <div className="btn_wrapper">
        <div className={cls} />
        <button className="sa-right-sidebar-button">{symbol}</button>
      </div>
    </div>
  );
};

const mapStoreToProps = state => {
  return {
    element: state.saRightSidebar.element
  };
};

export default connect(mapStoreToProps)(RightSidebarButton);
