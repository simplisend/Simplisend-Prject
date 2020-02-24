import React from "react";
import icons from "../../../../../configs/icons";

const MailItem = () => {
  return (
    <div className="mail-item">
      <div className="item-logo" />
      <div className="item-text">
        {"Application for\nmaster degree  in architecture"}
      </div>
      <div className="item-info">
        <span className="info-text">Status: Submited</span>
        <span className="info-text">Date: 20.02.2018</span>
      </div>
      <div className="option-item">
        <button className="option-button">{icons.open}</button>
        <button className="option-button">{icons.delete}</button>
      </div>
    </div>
  );
};

export default MailItem;
