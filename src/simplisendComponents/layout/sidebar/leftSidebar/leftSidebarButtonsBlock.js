import React, { Component } from "react";
import LeftSidebarItem from "./leftSidebarItem";
import { updateData } from "../../../../store/actions/rootActions";
import { connect } from "react-redux";

//<Translator string = {title} />

class LeftSidebarButtonsBlock extends Component {
  setLeftSidebarActiveButton = name => {
    const { leftSidebarActiveButton } = this.props;
    const currentActive = name === leftSidebarActiveButton ? null : name;
    this.props.updateData("SS_LEFT_SIDE_BAR_ACTIVE", currentActive);
  };

  render = () => {
    const { title, buttons } = this.props;
    return (
      <div className="btn-block">
        {buttons.length > 0 && <div className="block-title">{title}</div>}

        {buttons.map((item, i) => {
          return (
            <LeftSidebarItem
              key={item.id}
              title={item.title}
              symbol={item.symbol}
              text={item.text}
              action={() => this.setLeftSidebarActiveButton(item.title)}
            />
          );
        })}
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    leftSidebarActiveButton: state.ssLeftSidebar.activeButton
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
)(LeftSidebarButtonsBlock);
