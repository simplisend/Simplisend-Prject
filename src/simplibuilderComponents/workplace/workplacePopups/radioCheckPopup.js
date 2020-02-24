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
import { PopupItem } from "./popupElements";
import generateRandromString from "../../../funcs/generateRandromString";
import messages from "../../../configs/messages";
import { getRequest } from "../../../funcs/http";
import TextareaAutosize from "react-autosize-textarea";

class RadioCheckPopup extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    const { radioCheck, activeElement, autoCompleteOptions } = this.props;
    /* when user opens a new shortText */
    if (
      activeElement &&
      !radioCheck[activeElement.id] &&
      (activeElement.type === "radioChoice" ||
        activeElement.type === "checkBox")
    ) {
      this.props.updateData("SET_RADIOCHECK", activeElement.id);
      return;
    }

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

  /*
    send new words to be created in database
  */
  getNewWords = () => {
    const { radioCheck, activeElement, selectedForm } = this.props;
    const words = {};
    
    words[`${activeElement.id}_radioCheck_ask`] = {
      translation_id: null,
      content: radioCheck[activeElement.id]["ask"]["value"],
      language: selectedForm.default_lang.id
    };

    words[`${activeElement.id}_radioCheck_generalDiscription`] = {
      translation_id: null,
      content: radioCheck[activeElement.id]["ask"]["generalDiscription"],
      language: selectedForm.default_lang.id
    };

    words[`${activeElement.id}_radioCheck_tag`] = {
      translation_id: null,
      content: radioCheck[activeElement.id]["ask"]["tag"],
      language: selectedForm.default_lang.id
    };


    radioCheck[activeElement.id]["items"].map((item, index) => {
      words[`${activeElement.id}_radioCheck_tag_${index}`] = {
        translation_id: null,
        content: item.tag,
        language: selectedForm.default_lang.id
      };

      return null;
    });

    return words;
  };

  /* change the content of ask input */
  changeQuestion = (e, key, search = true) => {
    const { activeElement, radioCheck } = this.props;
    const updatedRadioCheck = { ...radioCheck[activeElement.id] };

    if (updatedRadioCheck["ask"][key].length > 3 && search) {
      this.getWords(updatedRadioCheck["ask"][key], key);
    }
    updatedRadioCheck["ask"][key] = e.target.value;
    this.props.updateData("UPDATE_RADIOCHECK", {
      key: activeElement.id,
      radioCheck: updatedRadioCheck
    });
  };

  /* change content of answer input based on it's index */
  changeItemContent = (e, index) => {
    const { radioCheck, activeElement } = this.props;
    const updatedPart = radioCheck[activeElement.id]["items"];
    updatedPart[index] = { ...updatedPart[index], tag: e.target.value };
    const updatedRadioCheck = {
      ...radioCheck[activeElement.id],
      items: updatedPart
    };
    this.props.updateData("UPDATE_RADIOCHECK", {
      key: activeElement.id,
      radioCheck: updatedRadioCheck
    });
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
        item: { id: `${activeElement.id}_radioCheck_${key}` }
      });
    });
  };

  /* when user submits changes */
  submit = () => {
    const { radioCheck, activeElement, newWords } = this.props;
    const isValid = this.validate();
    if (isValid) {
      const elements = radioCheck[activeElement.id]["items"].map((item, i) => ({
        ...item,
        index: i + 1,
        type: `${activeElement.type}`,
        inputId: radioCheck[activeElement.id]["ask"]["inputId"]
      }));

      elements.splice(0, 0, {
        ...radioCheck[activeElement.id]["ask"],
        id: activeElement.id,
        generalDiscription: radioCheck[activeElement.id]["ask"][
          "generalDiscription"
        ].trim()
      });

      this.props.updateData("SET_FORM_DETAILS", {
        key: activeElement.id,
        details: elements,
        type: "activeDetails"
      });

      const type = `SHOW_${activeElement.type}`.toUpperCase();
      this.props.updateData(type, false);
      let words = this.getNewWords();
      words = { ...newWords, ...words };
      this.props.updateData("ADD_NEW_WORD", {
        key: activeElement.id,
        words
      });
      this.setState({ newWords: {} });
      return;
    }
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
    //this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  cancel = () => {
    this.props.updateData("SHOW_RADIOCHOICE", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  /* add item input field */
  addItem = () => {
    const { radioCheck, activeElement } = this.props;
    const newItem = {
      tag: "",
      id: generateRandromString(),
      type: "radioCheck",
      checked: false,
      inputId: radioCheck[activeElement.id]["ask"]["inputId"]
    };
    const updatedRadioCheck = {
      ...radioCheck[activeElement.id],
      items: [...radioCheck[activeElement.id]["items"], newItem]
    };
    this.props.updateData("UPDATE_RADIOCHECK", {
      key: activeElement.id,
      radioCheck: updatedRadioCheck
    });
  };

  /* remove item field */
  removeItem = index => {
    const { radioCheck, activeElement } = this.props;
    if (radioCheck[activeElement.id]["items"].length > 1) {
      const updatedItems = [...radioCheck[activeElement.id]["items"]];
      updatedItems.splice(index, 1);
      const updatedRadioCheck = {
        ...radioCheck[activeElement.id],
        items: [...updatedItems]
      };
      this.props.updateData("UPDATE_RADIOCHECK", {
        key: activeElement.id,
        radioCheck: updatedRadioCheck
      });
    }
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

  /* when user click on one of auto-complete option */
  handleAutoCompleteOptionClick = (item, key) => {
  
    const { activeElement, radioCheck } = this.props;
    const updatedRadioCheck = { ...radioCheck[activeElement.id] };
    updatedRadioCheck["ask"][key] = item.content;
    this.props.updateData("UPDATE_RADIOCHECK", {
      key: `${activeElement.id}_radioCheck_ask`,
      radioCheck: updatedRadioCheck
    });
    this.closeAutoCompleteOptions();
  };

  /* validate when user submits */
  validate = () => {
    const { radioCheck, activeElement } = this.props;

    let isValid = true;
    let i = 0;
    if (!radioCheck[activeElement.id]["ask"]["value"]) {
      return false;
    }

    if (!radioCheck[activeElement.id]["ask"]["inputId"]) {
      return false;
    }

    for (i; i < radioCheck[activeElement.id]["items"].length; i++) {
      const item = radioCheck[activeElement.id]["items"][i];

      if (!item.tag) {
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  toggleCheck = () => {
    const { radioCheck, activeElement } = this.props;
    const updatedRadioCheck = {
      ask: {
        ...radioCheck[activeElement.id]["ask"],
        hasTag: !radioCheck[activeElement.id]["ask"]["hasTag"]
      },
      items: [...radioCheck[activeElement.id]["items"]]
    };

    this.props.updateData("UPDATE_RADIOCHECK", {
      key: activeElement.id,
      radioCheck: updatedRadioCheck
    });
  };

  render = () => {
    const {
      language,
      show,
      radioCheck,
      activeElement,
      showAutoCompleteOptionsPopup,
      showFormNamelessError,
      autoCompleteOptions,
      activeAutoCompleteItem
    } = this.props;
    const error = messages[language]["allFieldsRequired"]["text"];

    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={show}>
          <div className="popup-header">
            {activeElement && <Translator string={activeElement.type} />}
          </div>
          <div className="popup-body">
            <h3>
              <Translator string="shortTextPopupAsk" />
            </h3>

            <TextareaAutosize
              type="text"
              onChange={e => this.changeQuestion(e, "value")}
              value={
                Object.keys(radioCheck).length &&
                activeElement &&
                !activeElement.parentId &&
                radioCheck[activeElement.id]
                  ? radioCheck[activeElement.id]["ask"]["value"]
                  : ""
              }
              className="input-field"
              placeholder={translator("shortTextPopupAsk", titles[language])}
            />

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_radioCheck_value`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e =>
                  this.handleAutoCompleteOptionClick(e, "value")
                }
              />
            </div>

            <h3>
              <Translator string="shortTextPopupPlaceholder" />
            </h3>
            <TextareaAutosize
              type="text"
              value={
                Object.keys(radioCheck).length &&
                activeElement &&
                !activeElement.parentId &&
                radioCheck[activeElement.id]
                  ? radioCheck[activeElement.id]["ask"]["inputId"]
                  : ""
              }
              className="input-field"
              placeholder={translator(
                "shortTextPopupPlaceholder",
                titles[language]
              )}
              onChange={(e, k) => this.changeQuestion(e, "inputId")}
            />

            <h3>
              <Translator string="generalDiscription" />
            </h3>
            <textarea
              type="text"
              onChange={(e, k) => this.changeQuestion(e, "generalDiscription")}
              value={
                activeElement && radioCheck[activeElement.id]
                  ? radioCheck[activeElement.id]["ask"]["generalDiscription"]
                  : ""
              }
              className="input-field"
              placeholder={translator(
                "generalDiscriptionPlaceholder",
                titles[language]
              )}
            ></textarea>
            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_radioCheck_generalDiscription`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e =>
                  this.handleAutoCompleteOptionClick(e, "generalDiscription")
                }
              />
            </div>

            <h3>
              <Translator string="tag" />
            </h3>
            <div className="flex-horizontal">
              <TextareaAutosize
                type="text"
                value={
                  Object.keys(radioCheck).length &&
                  activeElement &&
                  !activeElement.parentId &&
                  radioCheck[activeElement.id]
                    ? radioCheck[activeElement.id]["ask"]["tag"]
                    : ""
                }
                className="input-field"
                placeholder={translator("tag", titles[language])}
                onChange={(e, k) => this.changeQuestion(e, "tag")}
              />

              <input
                type="checkbox"
                onChange={this.toggleCheck}
                checked={
                  activeElement && radioCheck && radioCheck[activeElement.id]
                    ? radioCheck[activeElement.id]["ask"]["hasTag"]
                    : false
                }
              />
            </div>

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_radioCheck_tag`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e => this.handleAutoCompleteOptionClick(e, "tag")}
              />
            </div>

            <h3>
              <Translator string="choices" />
            </h3>

            <button className="pop-up-button" onClick={this.addItem}>
              <Translator string="add" />
            </button>

            <div className="input-wrapper">
              {activeElement &&
                radioCheck &&
                radioCheck[activeElement.id] &&
                radioCheck[activeElement.id]["items"].map((item, i) => {
                  return (
                    <PopupItem
                      language={language}
                      handleChange={this.changeItemContent}
                      index={i}
                      value={item.tag}
                      key={item.id}
                      updateAnswers={() => this.removeItem(i)}
                      type={item.type}
                    />
                  );
                })}
            </div>
          </div>

          <div className="pop-up-bottons-wrapper">
            {showFormNamelessError && <p className="error">{error}</p>}
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
    /* show error message based on language */
    language: state.lang.lang,

    /* whether to show this popup or not */
    show: state.workplacePopups.activeElement
      ? state.workplacePopups.activeElement.type === "checkBox"
        ? state.workplacePopups.checkBox
        : state.workplacePopups.radioChoice
      : false,

    radioCheck: state.workplaceElements.radioCheck,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,

    /* show error message when validation is error upon submitting */
    showFormNamelessError: state.messages.showFormNamelessError,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showAutoCompleteOptionsPopup: state.translation.showAutoCompleteOptions,
    selectedForm: state.activeItems.selectedForm,
    activeAutoCompleteItem: state.activeItems.activeAutoCompleteItem,
    newWords: state.translation.newWords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RadioCheckPopup);
