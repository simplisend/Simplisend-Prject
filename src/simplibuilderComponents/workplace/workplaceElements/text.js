import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import TextItem from "./textItem";
import {
  ClickOutsideComponent,
  ClickOutsideOptionsList
} from "../../../components/utils";

class Text extends Component {
  /* change title */
  handleChange = e => {
    const { activeWorkplaceElement } = this.props;
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
      ...activeWorkplaceElement,
      title: e.target.value
    });
  };

  /* when user click on one of auto-complete options */
  handleAutoCompleteOptionClick = item => {
    const { activeDetails, id, autoCompleteActiveItem } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    updatedFormDetails[autoCompleteActiveItem.index]["title"] = item.content;
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedFormDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
    this.closeAutoCompleteOptions();
    this.props.updateData("ADD_NEW_WORD", { key: id, text: item });
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

  /* update active content when user clicks outside it */
  updateTextContent = index => {
    const {
      activeDetails,
      id,
      activeWorkplaceElement,
      selectedForm
    } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    const typ = /([a-zA-Z]+)\d+/.exec(activeWorkplaceElement.id)[1];

    const value = activeWorkplaceElement.title
      ? activeWorkplaceElement.title
      : typ === "textArea"
      ? typ
      : "heading";

    updatedFormDetails[index]["title"] = value;

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
        content: activeWorkplaceElement.title,
        language: selectedForm.default_lang.id
      }
    });
    this.closeAutoCompleteOptions();
  };

  handleKeyPress = (e, index) => {
    const { activeWorkplaceElement } = this.props;
    if (e.key === "Enter" && activeWorkplaceElement) {
      this.updateTextContent(index);
    }
  };

  render = () => {
    const {
      id,
      activeDetails,
      activeWorkplaceElement,
      showAutoCompleteOptions,
      autoCompleteOptions,
      autoCompleteActiveItem
    } = this.props;

    return (
      <div>
        <div className="dropped_content">
          <div className="question-container">
            {activeDetails[id] &&
              activeDetails[id].map((item, i) => {
                return (
                  <div key={item.id}>
                    <ClickOutsideComponent
                      handleClick={() => this.updateTextContent(i)}
                      condition={
                        activeWorkplaceElement &&
                        activeWorkplaceElement.id === id &&
                        !showAutoCompleteOptions
                      }
                    >
                      {item.isRequired && <span className="error"> * </span>}
                      <TextItem
                        value={
                          activeWorkplaceElement &&
                          activeWorkplaceElement.id === item.id
                            ? activeWorkplaceElement.title
                            : item.title
                        }
                        handleChange={this.handleChange}
                        autoFocus={true}
                        edit={
                          activeWorkplaceElement &&
                          activeWorkplaceElement.id === item.id
                        }
                        activate={() =>
                          this.props.updateData(
                            "SET_ACTIVE_WORKPLACE_ELEMENT",
                            { id: item.id, title: item.title }
                          )
                        }
                        id={item.id}
                        index={i}
                        handleKeyPress={e => this.handleKeyPress(e, i)}
                        cls={
                          item.type === "textArea"
                            ? "text-block"
                            : "header-input"
                        }
                      />
                    </ClickOutsideComponent>

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
                        noDataHandleClick={() => this.updateTextContent(i)}
                        noDataCondition={activeWorkplaceElement !== null}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    /* which element is now active */
    activeWorkplaceElement: state.workPlacePage.activeWorkplaceElement,

    /* details for (simpliBuilder)*/
    activeDetails: state.formDetails.activeDetails,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showAutoCompleteOptions: state.translation.showAutoCompleteOptions,
    autoCompleteActiveItem: state.activeItems.autoCompleteActiveItem,
    selectedForm: state.activeItems.selectedForm
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(Text);
