import React, { Component } from "react";
import {
  Translator,
  ClickOutsideComponent,
  ClickOutsideOptionsList
} from "../../../components/utils";
import { connect } from "react-redux";
import TextItem from "./textItem";
import { updateData } from "../../../store/actions/rootActions";
import icons from "../../../configs/icons";

class File extends Component {
  /* when user finish updating content */
  updateTextContent = () => {
    const {
      activeWorkplaceElement,
      activeDetails,
      id,
      selectedForm
    } = this.props;
    const updatedActiveDetails = {
      ...activeDetails[id],
      value: activeWorkplaceElement.value
    };
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedActiveDetails,
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
    this.closeAutoCompleteOptions();
  };

  /* while user is updating content */
  handleChange = e => {
    const { id } = this.props;
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
      id,
      value: e.target.value
    });
  };

  closeAutoCompleteOptions = () => {
    this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS_POPUP", false);
    this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", null);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
  };

  /* when user hits enter key */
  handleKeyPress = e => {
    const { activeWorkplaceElement, id } = this.props;
    if (
      e.key === "Enter" &&
      activeWorkplaceElement &&
      activeWorkplaceElement.id === id
    ) {
      this.updateTextContent();
    }
  };

  openPopup = e => {
    const { activeDetails, id } = this.props;
    this.props.updateData("SET_UPLOADFILE", {
      key: id,
      item: activeDetails[id],
      title: "uploadFile"
    });
    this.props.updateData(`SHOW_UPLOADFILE`, true);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      id,
      type: "uploadFile"
    });
    e.preventDefault();
  };

  handlePress = () => {
    const { selected, activeDetails, id } = this.props;
    const { isRequired } = activeDetails[id];

    if (selected.indexOf("btn-Requierd") !== -1) {
      this.props.updateData("SET_FORM_DETAILS", {
        key: id,
        details: { ...activeDetails[id], isRequired: !isRequired },
        type: "activeDetails"
      });
    }
  };

  render = () => {
    const {
      activeDetails,
      id,
      activeWorkplaceElement,
      showAutoCompleteOptions,
      autoCompleteActiveItem,
      autoCompleteOptions,
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
          <div
            className="question-container"
            style={{
              pointerEvents: selectedBtnActive ? "none" : "auto"
            }}
          >
            <ClickOutsideComponent
              handleClick={this.updateTextContent}
              condition={
                activeWorkplaceElement && activeWorkplaceElement.id === id
              }
            >
              <TextItem
                value={
                  activeWorkplaceElement && activeWorkplaceElement.id === id
                    ? activeWorkplaceElement.value
                    : activeDetails[id]["value"]
                }
                handleChange={this.handleChange}
                autoFocus={true}
                edit={
                  activeWorkplaceElement && activeWorkplaceElement.id === id
                }
                activate={() =>
                  this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
                    id: id,
                    value: activeDetails[id]["value"]
                  })
                }
                id={id}
                handleKeyPress={e => this.handleKeyPress(e)}
                cls={"question-input"}
              />
            </ClickOutsideComponent>

            

            {active && active === "btn-Divide" && (
              <div className="details-btn" onClick={this.openPopup}>
                {icons.property}
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
                handleClick={this.updateTextContent}
              />
            </div>
          </div>
        </div>
        <div className="workplace-droppable-item">
        {activeDetails[id]["hasTag"] &&
            activeDetails[id]["isRequired"] === true ? (
              <p className="required">{activeDetails[id]["tag"]}</p>
            ) : (
              <p>{activeDetails[id]["tag"]}</p>
            )}
          <button className="sb-upload-btn" disabled={true}>
            <Translator string="uploadFile" />
          </button>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    activeDetails: state.formDetails.activeDetails,
    activeWorkplaceElement: state.workPlacePage.activeWorkplaceElement,
    selectedForm: state.activeItems.selectedForm,
    showAutoCompleteOptions: state.translation.showAutoCompleteOptions,
    autoCompleteActiveItem: state.activeItems.autoCompleteActiveItem,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    active: state.formToolBar.selectEditActive,
    /* which header buttons is selected now*/
    selected: state.formToolBar.selected
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
)(File);
