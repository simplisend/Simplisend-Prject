import React, { Component } from "react";
import LeftSideBarButtonsBlock from "./leftSidebarButtonsBlock";
import { connect } from "react-redux";
import { Translator } from "../../../../components/utils";
import { updateData } from "../../../../store/actions/rootActions";

class LeftSidebar extends Component {
  render = () => {
    const { buttons, translatorIsOpened } = this.props;
    const cls = translatorIsOpened
      ? "sidebar-translator-btn active"
      : "sidebar-translator-btn";
    return (
      <div>
        <div className="sB-title">Self Descovery Tool</div>

        <button
          className={cls}
          onClick={() =>
            this.props.updateData(
              "SA_SET_TRANSLATOR_IS_OPENED",
              !translatorIsOpened
            )
          }
        >
          <Translator string="translator" />
        </button>

        <div className="sb_wrapper">
          {Object.keys(buttons).map(k => {
            return (
              <LeftSideBarButtonsBlock title={k} buttons={buttons[k]} key={k} />
            );
          })}
        </div>
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    buttons: state.saLeftSidebar.buttons,
    translatorIsOpened: state.saLeftSidebar.translatorIsOpened
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
)(LeftSidebar);
