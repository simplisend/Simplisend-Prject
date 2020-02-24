import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import { ClickOutsideComponent } from "../../../components/utils";
import icons from "../../../configs/icons";
import TextItem from "./textItem";
import { ClickOutsideOptionsList } from "../../../components/utils";

class RadioCheck extends Component {
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
    this.props.updateData("SET_RADIOCHECK", {
      key: id,
      items: activeDetails[id],
      title: activeDetails[id][1]["type"].split("_")[0]
    });
    const type = activeDetails[id][1]["type"].split("_")[0].toUpperCase();
    this.props.updateData(`SHOW_${type}`, true);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      id,
      type: activeDetails[id][1]["type"].split("_")[0]
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
    const { activeWorkplaceElement } = this.props;
    if (e.key === "Enter" && activeWorkplaceElement) {
      this.updateTextContent(e);
      this.closeAutoCompleteOptions();
    }
  };

  handlePress = () => {
    const { selected, activeDetails, id } = this.props;
    const { isRequired } = activeDetails[id][0];

    if (selected.indexOf("btn-Requierd") !== -1) {
      this.props.updateData("SET_FORM_DETAILS", {
        key: id,
        details: [
          { ...activeDetails[id][0], isRequired: !isRequired },
          ...activeDetails[id].slice(1)
        ],
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
      <div
        style={{ cursor: selectedBtnActive ? "pointer" : "default" }}
        onClick={this.handlePress}
      >
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
                  {activeDetails[id][0]["hasTag"] && (
                    <div>
                      {activeDetails[id][0]["isRequired"] === true ? (
                        <p className="required">
                          {activeDetails[id][0]["tag"]}
                        </p>
                      ) : (
                        <p>{activeDetails[id][0]["tag"]}</p>
                      )}
                    </div>
                  )}
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
                key={i}
                className="workplace-droppable-item block-element-row"
                style={{
                  pointerEvents: selectedBtnActive ? "none" : "auto"
                }}
              >
                <div className="input-row">
                  <input
                    type={item.type === "radioChoice" ? "radio" : "checkbox"}
                    disabled={true}
                    value={item.tag}
                    className="checkBox"
                  />
                  <span className="input-tag">{item.tag}</span>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RadioCheck);
