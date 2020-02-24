import React, { Component } from "react";
import { connect } from "react-redux";
import titles from "../../../configs/title";
import translator from "../../../funcs/translator";
import {
  Translator,
  PopUp,
  ClickOutsideOptionsList
} from "../../../components/utils";
import { updateData } from "../../../store/actions/rootActions";
import { getRequest } from "../../../funcs/http";

class FilePopup extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    const { activeElement, files } = this.props;
    if (
      activeElement &&
      !files[activeElement.id] &&
      activeElement.type === "uploadFile"
    ) {
      this.props.updateData("SET_UPLOADFILE", activeElement.id);
      return;
    }
  };

  validate = () => {
    const { files, activeElement } = this.props;
    if (
      !files[activeElement.id]["inputId"] ||
      !files[activeElement.id]["value"]
    ) {
      return false;
    }
    return true;
  };

  getNewWords = () => {
    const {files,activeElement,selectedForm } = this.props ; 
    const words = {} ; 
    words[`${activeElement.id}_file_text`] = {
      translation_id: null,
      content: files[activeElement.id]["value"],
      language: selectedForm.default_lang.id
    };
    words[`${activeElement.id}_file_disc`] = {
      translation_id: null,
      content: files[activeElement.id]["generalDiscription"],
      language: selectedForm.default_lang.id
    };
    words[`${activeElement.id}_file_tag`] = {
      translation_id: null,
      content: files[activeElement.id]["tag"],
      language: selectedForm.default_lang.id
    };
    return words ; 
  }


  submit = () => {
    const { activeElement, files, newWords } = this.props;
    const isValid = this.validate();
    //const words = { ...newWords };
    if (isValid) {
      this.props.updateData("SET_FORM_DETAILS", {
        key: activeElement.id,
        details: { ...files[activeElement.id], elementId: activeElement.id },
        type: "activeDetails"
      });
      this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
      this.props.updateData("SHOW_UPLOADFILE", false);
      const words = {...newWords , ...this.getNewWords()} ; 
      this.props.updateData("ADD_NEW_WORD", { key: activeElement.id, words });

      return;
    }

    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  cancel = () => {
    this.props.updateData("SHOW_UPLOADFILE", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  handleChange = (e, key) => {
    const { activeElement, files } = this.props;
    const item = { ...files[activeElement.id], [key]: e.target.value };
    if (
      e.target.value.length >= 3 &&
      (key === "generalDiscription" || key === "tag" || key === "value")
    ) {
      this.getWords(e.target.value, key);
    }
    this.props.updateData("SET_UPLOADFILE", { key: activeElement.id, item });
  };

  /* get all matching data when user is filling question input */
  getWords = (value, key) => {
    const { selectedForm, activeElement } = this.props;
    const formLanguage = selectedForm.default_lang.id;

    getRequest(
      `text/form_text_contains?lang=${formLanguage}&text=${value}`
    ).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", resp.data);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeAutoCompleteItem",
        item: { id: `${activeElement.id}_file_${key}` }
      });
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

  handleOptionClick = (item, key) => {
    const { activeElement, files } = this.props;
    const updatedFileItem = { ...files[activeElement.id] };
    updatedFileItem[key] = item.content;
    this.props.updateData("SET_UPLOADFILE", {
      key: activeElement.id,
      item: updatedFileItem
    });
    this.closeAutoCompleteOptions();
  };

  toggleCheck = () => {
    const { activeElement, files } = this.props;
    const updatedFile = {
      ...files[activeElement.id],
      hasTag: !files[activeElement.id]["hasTag"]
    };
    this.props.updateData("SET_UPLOADFILE", {
      key: activeElement.id,
      item: updatedFile
    });
  };

  render = () => {
    const {
      show,
      activeElement,
      files,
      autoCompleteOptions,
      language,
      showFormNamelessError,
      showAutoCompleteOptionsPopup,
      activeAutoCompleteItem
    } = this.props;

    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={show}>
          <div className="popup-header">
            <Translator string="filePopup" />
          </div>

          <div className="popup-body">
            <h3>
              <Translator string="filePopup" />
            </h3>
            <div className="content-wrapper">
              {showFormNamelessError && <p className="error"> * </p>}
              <p>
                <input
                  type="text"
                  onChange={e => this.handleChange(e, "inputId")}
                  placeholder={translator(
                    "shortTextPopupPlaceholder",
                    titles[language]
                  )}
                  value={
                    activeElement && files[activeElement.id]
                      ? files[activeElement.id]["inputId"]
                      : ""
                  }
                  className="input-field"
                />
              </p>
              {showFormNamelessError && <p className="error"> * </p>}
              <p>
                <input
                  type="text"
                  onChange={e => this.handleChange(e, "value")}
                  value={
                    activeElement && files[activeElement.id]
                      ? files[activeElement.id]["value"]
                      : ""
                  }
                  className="input-field"
                  placeholder={translator(
                    "shortTextPopupAsk",
                    titles[language]
                  )}
                />
              </p>
              <div className="shorttext-options-conainer">
                <ClickOutsideOptionsList
                  hide={this.closeAutoCompleteOptions}
                  show={
                    showAutoCompleteOptionsPopup &&
                    activeAutoCompleteItem &&
                    activeElement &&
                    activeAutoCompleteItem.id ===
                      `${activeElement.id}_file_value`
                  }
                  options={autoCompleteOptions ? autoCompleteOptions : []}
                  renderKey="content"
                  handleClick={e => this.handleOptionClick(e, "value")}
                />
              </div>

              <div className="flex-horizontal">
                <input
                  type="text"
                  onChange={e => this.handleChange(e, "tag")}
                  value={
                    activeElement && files[activeElement.id]
                      ? files[activeElement.id]["tag"]
                      : ""
                  }
                  className="input-field"
                  placeholder={translator("tag", titles[language])}
                />
                <input
                  type="checkbox"
                  checked={
                    activeElement && files[activeElement.id]
                      ? files[activeElement.id]["hasTag"]
                      : false
                  }
                  onChange={this.toggleCheck}
                />
              </div>

              <div className="shorttext-options-conainer">
                <ClickOutsideOptionsList
                  hide={this.closeAutoCompleteOptions}
                  show={
                    showAutoCompleteOptionsPopup &&
                    activeAutoCompleteItem &&
                    activeElement &&
                    activeAutoCompleteItem.id === `${activeElement.id}_file_tag`
                  }
                  options={autoCompleteOptions ? autoCompleteOptions : []}
                  renderKey="content"
                  handleClick={e => this.handleOptionClick(e, "tag")}
                />
              </div>

              <p>
                <textarea
                  type="text"
                  onChange={e => this.handleChange(e, "generalDiscription")}
                  value={
                    activeElement && files[activeElement.id]
                      ? files[activeElement.id]["generalDiscription"]
                      : ""
                  }
                  className="input-field"
                  placeholder={translator(
                    "generalDiscription",
                    titles[language]
                  )}
                ></textarea>
              </p>
              <div className="shorttext-options-conainer">
                <ClickOutsideOptionsList
                  hide={this.closeAutoCompleteOptions}
                  show={
                    showAutoCompleteOptionsPopup &&
                    activeAutoCompleteItem &&
                    activeElement &&
                    activeAutoCompleteItem.id ===
                      `${activeElement.id}_file_generalDiscription`
                  }
                  options={autoCompleteOptions ? autoCompleteOptions : []}
                  renderKey="content"
                  handleClick={e =>
                    this.handleOptionClick(e, "generalDiscription")
                  }
                />
              </div>
            </div>
          </div>

          <div className="pop-up-bottons-wrapper">
            <button className="pop-up-button" onClick={this.submit}>
              <Translator string="ok" />
            </button>
            <button className="pop-up-button" onClick={this.cancel}>
              <Translator string="cancel" />
            </button>
          </div>
        </PopUp>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* whether to show this popup or not */
    show: state.workplacePopups.file,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,
    files: state.workplaceElements.files,
    activeDetails: state.formDetails.activeDetails,
    language: state.lang.lang,
    selectedForm: state.activeItems.selectedForm,
    showAutoCompleteOptionsPopup: state.translation.showAutoCompleteOptions,
    activeAutoCompleteItem: state.activeItems.activeAutoCompleteItem,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showFormNamelessError: state.messages.showFormNamelessError,
    newWords: state.translation.newWords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FilePopup);
