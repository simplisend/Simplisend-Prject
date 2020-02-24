import React, { Component } from "react";
import LeftSideBarButtonsBlock from "./leftSidebarButtonsBlock";
import { connect } from "react-redux";
import Translator from "../../../../components/utils/translator";

class LeftSidebar extends Component {
  render = () => {
    const { buttons } = this.props;
    return (
      <div>
        <div className="sB-title">Self Descovery Tool</div>
        <div className="sb_wrapper">
          {Object.keys(buttons).map(k => {
            return (
              <LeftSideBarButtonsBlock
                title={<Translator string={k} />}
                buttons={buttons[k]}
                key={k}
              />
            );
          })}
        </div>

        <button className="save_Filter_Btn">Save filter to your profile</button>
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    buttons: state.ssLeftSidebar.buttons
  };
};

export default connect(mapStoreToProps)(LeftSidebar);
