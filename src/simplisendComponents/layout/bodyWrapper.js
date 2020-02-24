import React, { Component } from "react";
import { Workplace } from "../workplace";
import LeftSidebar from "./sidebar/leftSidebar/leftSidebar";
import RightSidebar from "./sidebar/rightSidebar/rightSidebar";
import { FormDetails } from "../screens";
import { connect } from "react-redux";
import { PopUp, Translator } from "../../components/utils";

/* wraps start screen and everything between header and footer */
class BodyWrapper extends Component {
  componentWillMount = () => {
    this.props.updateData("TOGGLE_STARTER_SCREEN", true);
    this.props.updateData("SHOW_BUTTONS", false);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderActive",
      item: false
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderNavButtonClicked",
      item: false
    });
  };

  onConfirm = () => {
    this.props.updateData("SHOW_SIMPLISEND_BACK_POPUP", false);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
    this.props.history.push("/");
  };

  saveTemp = () => {
    this.props.updateData("SAVE_SIMPLISEND_TEMP_FORM", {
      key: this.props.activeFormDetails.id,
      form: this.props.formDetails[this.props.activeFormDetails.id]
    });
    this.props.updateData("SHOW_SIMPLISEND_BACK_POPUP", false);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
    this.props.history.push("/");
  };

  render = () => {
    const { activeFormDetails, ShowSimplisendBackPopup } = this.props;

    return (
      <div id="bodyContainer">
        <div id="left" className="ss_Left_sideBarContainer">
          <div
            className="ss_LSB-toggler"
            onClick={() => this.props.updateData("CLASS-TOGGLER")}
          ></div>
          <LeftSidebar {...this.props} />
        </div>

        {!activeFormDetails && <Workplace {...this.props} />}

        {activeFormDetails && <FormDetails />}

        <div className="ss_Right_sideBarContainer">
          <RightSidebar {...this.props} />
        </div>

        <div className="ss-main-popup-wrapper">
          <PopUp show={ShowSimplisendBackPopup}>
            <div className="popup-header">
              <Translator string="formDetailsExitTitle" />
            </div>
            <div className="popup-body">
              <div className="massage">
                <Translator string="formDetailsExitMessage" />
              </div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button className="pop-up-button" onClick={this.saveTemp}>
                <Translator string="formDetailsSavePersist" />
              </button>

              <button className="pop-up-button" onClick={this.onConfirm}>
                <Translator string="confirm" />
              </button>

              <button
                className="pop-up-button"
                onClick={() =>
                  this.props.updateData("SHOW_SIMPLISEND_BACK_POPUP", false)
                }
              >
                <Translator string="cancel" />
              </button>
            </div>
          </PopUp>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    activeFormDetails: state.activeItems.activeFormDetails,
    ShowSimplisendBackPopup: state.workplacePopups.simplisendBack,
    formDetails: state.formDetails.details
  };
};

export default connect(mapStateToProps)(BodyWrapper);
