import React from "react";
import { connect } from "react-redux";
import "../../../../store/reducers/jQueryReducers/toggle-func";

const RightSidebarButton = ({
  symbol,
  action,
  element,
  isAuthorized,
  type,
  language
}) => {
  /* if user is logged in then show the logout button */

  let cls = "";
  const titleParts = type.split("_");

  if (
    element === titleParts[0] ||
    element === titleParts[1] ||
    (element &&
      titleParts[0] === "Logout" &&
      ["mail", "library", "settings"].indexOf(element) === -1)
  ) {
    const clas =
      titleParts[0] === "login" ||
      titleParts[1] === "register" ||
      titleParts[0].toLowerCase() === "logout"
        ? "active_1"
        : "active_2";

    cls += ` ${clas}`;
  }

  return (
    <div onClick={action}>
      <div className="btn_wrapper">
        <div className={cls} />
        <button className="ss-right-sidebar-button toggle-case">
          {symbol}
        </button>
      </div>
    </div>
  );
};

const mapStoreToProps = state => {
  return {
    element: state.ssRightSidebar.element,
    isAuthorized: state.auth.isAuthorized,
    language: state.lang.lang
  };
};

export default connect(mapStoreToProps)(RightSidebarButton);
