import React, { Component } from "react";
import titles from "../../../../configs/title";
import translator from "../../../../funcs/translator";
import { ClickOutsideOptionsList } from "../../../../components/utils";
import { connect } from "react-redux";
import { updateData } from "../../../../store/actions/rootActions";
import { getRequest } from "../../../../funcs/http";

/* input element for all ask answer popup items (shortTextPopup,radioCheckPopuo ....)*/
class PopupItem extends Component {
  /* close autoCompleteOptions (this will remove previous data) */
  closeAutoCompleteOptions = () => {
    this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS_POPUP", false);
    this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", null);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
  };

  /* get all matching data when user is filling question input */
  getWords = value => {
    const { selectedForm, activeElement, index } = this.props;
    const formLanguage = selectedForm.default_lang.id;
    getRequest(
      `text/form_text_contains?lang=${formLanguage}&text=${value}`
    ).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", resp.data);
      this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS", true);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeAutoCompleteItem",
        item: { id: `${activeElement.id}_item_${index}`, index }
      });
    });
  };

  handleChange = (e, index, type) => {
    const { handleChange } = this.props;
    handleChange(e, index, type);
    if (e.target.value.length >= 3) {
      this.getWords(e.target.value);
    }
  };

  /* when user clicks on one of auto-complete option for shortText */
  handleShortTextAutoCompleteOptionClick = item => {
    const { activeElement, index } = this.props;
    const updatedAnswers = [...activeElement.answers];
    updatedAnswers[index]["tag"] = item.content;
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      ...activeElement,
      answers: updatedAnswers
    });
    this.closeAutoCompleteOptions();
  };

  /* when user clicks on one of auto-complete option for radioCheck */
  handleRadioCheckAutoCompleteOptionClick = item => {
    const { activeElement, radioCheck, index } = this.props;
    const updatedRadioCheck = { ...radioCheck[activeElement.id] };
    updatedRadioCheck["items"][index]["tag"] = item.content;
    this.props.updateData("UPDATE_RADIOCHECK", {
      key: activeElement.id,
      radioCheck: updatedRadioCheck
    });
    this.closeAutoCompleteOptions();
  };

  render = () => {
    const {
      hasTag,
      handleChange,
      index,
      tag,
      toggleTagAppearance,
      language,
      value,
      showAutoCompleteOptionsPopup,
      autoCompleteOptions,
      activeAutoCompleteItem,
      activeElement,
      type
    } = this.props;

    return (
      <div className="input-type">
        {(type === "shortText" || type === "textBlock") && (
          <div className="id-Input">
            <input
              value={value}
              type="text"
              onChange={e => handleChange(e, "inputId", index)}
              placeholder={translator(
                "shortTextPopupPlaceholder",
                titles[language]
              )}
            />
          </div>
        )}

        {hasTag && (type === "shortText" || type === "textBlock") && (
          <div className="tag-Input">
            <input
              value={tag}
              type="text"
              onChange={e => this.handleChange(e, "tag", index)}
              placeholder={translator("tag", titles[language])}
            />

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_item_${index}`
                  //activeAutoCompleteItem.id === `${activeElement.id}_shortText_tag_${index}`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={this.handleShortTextAutoCompleteOptionClick}
              />
            </div>
          </div>
        )}

        {type !== "shortText" && type !== "textBlock" && (
          <div className="tag-Input">
            <input
              value={value}
              type="text"
              onChange={e => this.handleChange(e, index, "tag")}
              placeholder={translator("tag", titles[language])}
            />
            {type === "shortText" && (
              <button onClick={() => this.props.updateAnswers("remove", index)}>
                {" "}
                -{" "}
              </button>
            )}

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_item_${index}`
                  //activeAutoCompleteItem.id === `${activeElement.id}_shortText_tag_${index}`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={this.handleRadioCheckAutoCompleteOptionClick}
              />
            </div>
          </div>
        )}

        {(type === "shortText" || type === "textBlock") && (
          <div className="checkbox">
            <input
              type="checkbox"
              checked={hasTag}
              onChange={() => toggleTagAppearance(index)}
            />
            {type === "shortText" && (
              <button onClick={() => this.props.updateAnswers("remove", index)}>
                {" "}
                -{" "}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* auto complete suggestions (when user types)*/
    autoCompleteOptions: state.translation.autoCompleteOptions,
    /* whether to show auto complete suggestions or not */
    showAutoCompleteOptionsPopup: state.translation.showAutoCompleteOptions,
    selectedForm: state.activeItems.selectedForm,
    activeAutoCompleteItem: state.activeItems.activeAutoCompleteItem,
    /* to which input field  auto complete suggestions belong */
    activeElement: state.workplacePopups.activeElement,
    shortText: state.workplaceElements.shortText,
    radioCheck: state.workplaceElements.radioCheck
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PopupItem);
