import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import WorkPlaceButton from "./workPlaceButton";
import WorkPlacePage from "./workPlacePage";
import { updateData } from "../../store/actions/rootActions";
import icons from "../../configs/icons";

import { FormWorkPlace } from "./formWorkplace";
import { PaperWorkplace } from "./paperWorkplace";

class WorkPlaceContainer extends Component {
  /* change the active button in wokplace */
  handleClick = e => {
    const id = e.target.id;
    const name = e.target.name;
    this.props.updateData("UPDATE_ACTIVE", id);
    this.props.updateData("SIDEBAR_BLOCK", name);
  };

  divideWorkPlace = e => {
    const id = e.target.id;
    const { isDivided } = this.props;
    /* if the desired mode is already applied ignore and do nothing else apply new mode  */
    if (
      (isDivided && id === "modeSplited_Wp") ||
      (!isDivided && id === "modeFullSize_Wp")
    ) {
      return;
    }
    const divide = id === "modeSplited_Wp" ? true : false;
    this.props.updateData("DIVIDE", divide);
  };

  render = () => {
    const { items } = this.props;
    const { isDivided } = this.props;

    return (
      <Fragment>
        {items.map((item, i) => {
          let left = "0rem";
          let right = "0rem";
          const page = item.page;
          const button = item.button;
          const position = isDivided ? "absolute" : "relative";
          let pageZIndex = page.zIndex;
          let pageCls = page.cls;

          if (item.page.id === this.props.currentActivePage) {
            pageZIndex = 100;
            pageCls = `${page.cls} active`;
          }

          if (i === 0 && isDivided) {
            left = "0rem";
            right = "51%";
          } else if (i !== 0 && isDivided) {
            left = "51%";
            right = "0rem";
          }

          const buttonCls =
            button.id === this.props.currentActiveButton
              ? `${button.cls} active`
              : button.cls;

          return (
            <Fragment key={page.id}>
              <WorkPlacePage
                name={page.name}
                cls={pageCls}
                id={page.id}
                zIndex={pageZIndex}
                left={left}
                right={right}
              >
                <Fragment>
                  {page.id === "formContainer" && <FormWorkPlace />}
                  {page.id === "paperContainer" && <PaperWorkplace />}
                </Fragment>
              </WorkPlacePage>

              <WorkPlaceButton
                name={button.name}
                position={position}
                left={left}
                right={right}
                cls={buttonCls}
                id={button.id}
                action={e => this.handleClick(e)}
              />
            </Fragment>
          );
        })}
        {this.props.items.length > 0 && (
          <div id="wp_mode">
            <button
              onClick={this.divideWorkPlace}
              id="modeFullSize_Wp"
              className={isDivided ? "btn_Wp_Mode" : "btn_Wp_Mode wp_active"}
            >
              {icons.new}
            </button>
            <button
              onClick={this.divideWorkPlace}
              id="modeSplited_Wp"
              className={isDivided ? "btn_Wp_Mode wp_active" : "btn_Wp_Mode"}
            >
              {icons.new}
              {icons.new}
            </button>
          </div>
        )}
      </Fragment>
    );
  };
}

const mapStoreToProps = state => {
  return {
    items: state.workplace.items /* each item is consists of button and page */,
    currentActivePage:
      state.workplace.currentActivePage /* which page is active now */,
    currentActiveButton:
      state.workplace.currentActiveButton /* which button is active now */,
    isDivided: state.workplace.isDivided /* is workplace divided or not */
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* update active page/button */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};
export default connect(mapStoreToProps, mapDispatchToProps)(WorkPlaceContainer);
