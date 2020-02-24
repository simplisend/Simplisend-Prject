import React, { Component } from "react";
import { connect } from "react-redux";
import TextItem from "./textItem";
import { updateData } from "../../../store/actions/rootActions";
import { ClickOutsideComponent } from "../../../components/utils";
import icons from "../../../configs/icons";

class Image extends Component {
  /* while user is typing */
  handleChange = e => {
    const { id } = this.props;
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
      id,
      value: e.target.value
    });
  };

  /* after user submits changes */
  changeDescriptionContent = () => {
    const { activeWorkplaceElement, id, activeDetails } = this.props;
    const updatedActiveDetails = {
      ...activeDetails[id],
      description: activeWorkplaceElement.value
    };
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedActiveDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
  };

  handleEnterPress = e => {
    const { id, activeWorkplaceElement } = this.props;
    if (
      e.key === "Enter" &&
      activeWorkplaceElement &&
      activeWorkplaceElement.id === id
    ) {
      this.changeDescriptionContent();
    }
  };

  openPopup = e => {
    const { activeDetails, id } = this.props;
    const item = { ...activeDetails[id], isNew: false };
    this.props.updateData("SET_IMAGE", { key: id, image: item });
    this.props.updateData(`SHOW_IMAGE`, true);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", { id, type: "image" });
    e.preventDefault();
  };

  render = () => {
    const { activeDetails, id, activeWorkplaceElement, active } = this.props;
    let width, height, description;

    if (activeDetails[id]) {
      width = activeDetails[id]["user_width"];
      height = activeDetails[id]["user_height"];
      description = activeDetails[id]["description"];
    }

    return (
      <div>
        {activeDetails[id] && (
          <div>
            <div className="dropped_content">
              <div className="question-container">
                {description && (
                  <ClickOutsideComponent
                    handleClick={this.changeDescriptionContent}
                    condition={
                      activeWorkplaceElement && activeWorkplaceElement.id === id
                    }
                  >
                    <TextItem
                      value={
                        activeWorkplaceElement &&
                        activeWorkplaceElement.id === id
                          ? activeWorkplaceElement.value
                          : description
                      }
                      handleChange={this.handleChange}
                      autoFocus={true}
                      activate={() =>
                        this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
                          id,
                          value: activeDetails[id]["description"]
                        })
                      }
                      edit={
                        activeWorkplaceElement &&
                        activeWorkplaceElement.id === id
                      }
                      handleKeyPress={this.handleEnterPress}
                      cls="question-input"
                    />
                  </ClickOutsideComponent>
                )}

                {activeDetails[id]["hasTag"] && (
                  <p>{activeDetails[id]["tag"]}</p>
                )}

                {active && active === "btn-Divide" && (
                  <div className="details-btn" onClick={this.openPopup}>
                    {icons.property}
                  </div>
                )}
              </div>
            </div>

            <img
              className="img"
              alt="img"
              src={
                activeDetails[id]["img"] && activeDetails[id]["isNew"]
                  ? activeDetails[id]["img"]
                  : activeDetails[id]["url"]
              }
              style={{ width: Number(width), height: Number(height) }}
            />
          </div>
        )}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    activeDetails: state.formDetails.activeDetails,
    activeWorkplaceElement: state.workPlacePage.activeWorkplaceElement,
    active: state.formToolBar.selectEditActive
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Image);
