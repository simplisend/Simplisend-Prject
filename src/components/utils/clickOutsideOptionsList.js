import React, { Component } from "react";
import ClickOutsideComponent from "./clickOutsideComponent";

class ClickOutsideOptionsList extends Component {
  render = () => {
    const {
      options,
      hide,
      show,
      handleClick,
      renderKey,
      noDataHandleClick,
      noDataCondition
    } = this.props;

    /*
      handleClick when there is data returned fro database
      noDataHandleClick when the returned data is empty (so user does not have to click twice to hide this)
    */
    const lookup = renderKey ? renderKey : "value";
    if (show) {
      return (
        <ClickOutsideComponent
          condition={true}
          handleClick={() =>
            options.length
              ? hide()
              : noDataCondition
              ? noDataHandleClick()
              : null
          }
        >
          {options.map(item => {
            return (
              <p
                key={item.id}
                className="options-list-item"
                onClick={() => handleClick(item)}
              >
                {item[lookup]}
              </p>
            );
          })}
        </ClickOutsideComponent>
      );
    }
    return null;
  };
}

export default ClickOutsideOptionsList;
