import React, { Component } from "react";

class PopUp extends Component {
  render = () => {
    const { children, show } = this.props;

    return (
      <div>
        {show && (
          <div className="pop-up-wrapper">
            <div className="pop-up">{children}</div>
          </div>
        )}
      </div>
    );
  };
}

export default PopUp;
