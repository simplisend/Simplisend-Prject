import React from "react";
import { Translator } from "../../../components/utils";

/*
  buttons in left side bar
  will be  used in sidebar.js
*/
const SideBarButton = ({ title, id, icon, action, index,type }) => {
  
  return (
    <div className="sb_sidebarButton" onClick={action} name={title}>
      <span className="symbol-btn_4">{icon}</span>
      <span className="btn-Text">
        <Translator string={type} />
      </span>
    </div>
  );
};

export default SideBarButton;
