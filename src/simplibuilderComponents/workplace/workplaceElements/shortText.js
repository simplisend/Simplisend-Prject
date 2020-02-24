import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import { ClickOutsideComponent } from "../../../components/utils";
import icons from "../../../configs/icons";
import TextItem from "./textItem";
import { ClickOutsideOptionsList } from "../../../components/utils";

class ShortText extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    const { autoCompleteOptions } = this.props;
    /* if user gets data for the first time or */
    if (
      autoCompleteOptions &&
      autoCompleteOptions.length > 0 &&
      !prevProps.autoCompleteOptions
    ) {
      this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS", true);
      return;
    }

    /* if user got data previously (but it was empty data)*/
    if (
      autoCompleteOptions &&
      autoCompleteOptions.length > 0 &&
      !prevProps.autoCompleteOptions.length
    ) {
      this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS", true);
      return;
    }

    /* when user gets new data */
    if (
      prevProps.autoCompleteOptions &&
      autoCompleteOptions &&
      prevProps.autoCompleteOptions.length !== autoCompleteOptions.length
    ) {
      this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS", true);
      return;
    }
  };

  /* when user click on one of auto-complete options */
  handleAutoCompleteOptionClick = item => {
    const { activeDetails, id } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    updatedFormDetails[0]["value"] = item.content;
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedFormDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
    this.props.updateData("ADD_NEW_WORD", { key: id, text: item });
    this.closeAutoCompleteOptions();
  };

  /* when user is changing question content (before submitting changes)*/
  handleChange = e => {
    const { activeWorkplaceElement } = this.props;
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
      ...activeWorkplaceElement,
      value: e.target.value
    });
  };

  /* close autoCompleteOptions (this will remove previous data) */
  closeAutoCompleteOptions = () => {
    this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS", false);
    this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", null);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "autoCompleteActiveItem",
      item: null
    });
  };

  /* open shortText popup */
  openPopup = e => {
    const { activeDetails, id } = this.props;

    this.props.updateData("SET_SHORTTEXT", {
      key: id,
      answers: activeDetails[id],
      title: "shortText"
    });
    this.props.updateData("SHOW_SHORTTEXT", true);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      id,
      answers: activeDetails[id].slice(1),
      generalDiscription: activeDetails[id][0]["generalDiscription"],
      value: activeDetails[id][0]["value"],
      type: "shortText"
    });
    e.preventDefault();
  };
  /* change question content */
  updateTextContent = () => {
    const {
      activeDetails,
      id,
      activeWorkplaceElement,
      selectedForm
    } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    updatedFormDetails[0]["value"] = activeWorkplaceElement.value;
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedFormDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
    this.props.updateData("ADD_NEW_WORD", {
      key: id,
      text: {
        translation_id: null,
        content: activeWorkplaceElement.value,
        language: selectedForm.default_lang.id
      }
    });
  };

  /* if user hits enter key while changing question content */
  handleKeyPress = (e, index) => {
    const { activeWorkplaceElement, id } = this.props;
    if (
      e.key === "Enter" &&
      activeWorkplaceElement &&
      activeWorkplaceElement.id === id
    ) {
      this.updateTextContent(e);
      this.closeAutoCompleteOptions();
    }
  };

  handlePress = index => {
    const { selected, activeDetails, id } = this.props;

    const updatedDetails = [...activeDetails[id]];
    updatedDetails[index] = {
      ...updatedDetails[index],
      isRequired: !updatedDetails[index]["isRequired"]
    };

    if (selected.indexOf("btn-Requierd") !== -1) {
      this.props.updateData("SET_FORM_DETAILS", {
        key: id,
        details: updatedDetails,
        type: "activeDetails"
      });
    }
  };

  render = () => {
    const {
      activeDetails,
      id,
      activeWorkplaceElement,
      autoCompleteActiveItem,
      autoCompleteOptions,
      showAutoCompleteOptions,
      active,
      selected
    } = this.props;

    const selectedBtnActive = selected.indexOf("btn-Requierd") !== -1;

    return (
      <div style={{ cursor: selectedBtnActive ? "pointer" : "default" }}>
        <div className="dropped_content">
          <div className="question-container">
            {activeDetails[id] && activeDetails[id].length && (
              <div
                style={{
                  pointerEvents: selectedBtnActive ? "none" : "auto"
                }}
              >
                <ClickOutsideComponent
                  handleClick={() => this.updateTextContent()}
                  condition={
                    activeWorkplaceElement &&
                    activeWorkplaceElement.id === id &&
                    !showAutoCompleteOptions
                  }
                >
                  <TextItem
                    value={
                      activeWorkplaceElement && activeWorkplaceElement.id === id
                        ? activeWorkplaceElement.value
                        : activeDetails[id][0]["value"]
                    }
                    handleChange={this.handleChange}
                    autoFocus={true}
                    edit={
                      activeWorkplaceElement && activeWorkplaceElement.id === id
                    }
                    activate={() =>
                      this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
                        id,
                        value: activeDetails[id][0]["value"]
                      })
                    }
                    handleKeyPress={e => this.handleKeyPress(e)}
                    cls="question-input"
                    id={id}
                  />
                </ClickOutsideComponent>
                {active && active === "btn-Divide" && (
                  <div className="details-btn" onClick={this.openPopup}>
                    {icons.property}
                  </div>
                )}
              </div>
            )}

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptions &&
                  autoCompleteActiveItem &&
                  autoCompleteActiveItem.id === id
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={this.handleAutoCompleteOptionClick}
                noDataHandleClick={this.updateTextContent}
                noDataCondition={activeWorkplaceElement !== null}
              />
            </div>
          </div>
        </div>

        {activeDetails[id] &&
          activeDetails[id].slice(1).map((item, i) => {
            return (
              <div
                className="workplace-droppable-item block-element-row"
                onClick={() => this.handlePress(i + 1)}
                key={i}
              >
                {item.hasTag && (
                  <div
                    style={{
                      pointerEvents: selectedBtnActive ? "none" : "auto"
                    }}
                  >
                    {item.isRequired === true ? (
                      <p className="required">{item.tag}</p>
                    ) : (
                      <p>{item.tag}</p>
                    )}
                  </div>
                )}
                <input
                  type="text"
                  disabled={true}
                  className="short-text-input"
                  value={""}
                />
              </div>
            );
          })}
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    activeDetails: state.formDetails.activeDetails,
    activeWorkplaceElement: state.workPlacePage.activeWorkplaceElement,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showAutoCompleteOptions: state.translation.showAutoCompleteOptions,
    autoCompleteActiveItem: state.activeItems.autoCompleteActiveItem,
    selectedForm: state.activeItems.selectedForm,
    active: state.formToolBar.selectEditActive,
    /* which header buttons is selected now*/
    selected: state.formToolBar.selected
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShortText);
