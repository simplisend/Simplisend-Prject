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

class ShortTextPopup extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    const { shortText, activeElement, autoCompleteOptions } = this.props;

    /* when user opens a new shortText */
    if (
      activeElement &&
      !shortText[activeElement.id] &&
      activeElement.type === "shortText"
    ) {
      this.props.updateData("SET_SHORTTEXT", activeElement.id);
      return;
    }

    if (
      activeElement &&
      !prevProps.shortText[activeElement.id] &&
      shortText[activeElement.id] &&
      shortText[activeElement.id]
    ) {
      this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
        id: activeElement.id,
        answers: shortText[activeElement.id]["answers"],
        generalDiscription:
          shortText[activeElement.id]["ask"]["generalDiscription"],
        value: shortText[activeElement.id]["ask"]["value"],
        type: "shortText"
      });
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
    const { activeElement, selectedForm } = this.props;
    const words = {};
    words[`${activeElement.id}_shortText_ask`] = {
      translation_id: null,
      content: activeElement["value"],
      language: selectedForm.default_lang.id
    };

    words[`${activeElement.id}_shortText_generalDiscription`] = {
      translation_id: null,
      content: activeElement["generalDiscription"],
      language: selectedForm.default_lang.id
    };
    
    activeElement["answers"].map((item, index) => {
     
      if (item.tag) {
        words[`${activeElement.id}_shortText_tag_${index}`] = {
          translation_id: null,
          content: item.tag,
          language: selectedForm.default_lang.id
        };
      }
      return null;
    });
    return words;
  };

  /* change the content of ask input */
  changeQuestion = e => {
    const { activeElement } = this.props;
    const updatedActiveElement = { ...activeElement, value: e.target.value };
    if (activeElement["value"].length > 3) {
      this.getWords(activeElement["value"], "ask");
    }

    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", updatedActiveElement);
  };

  /* change content or tag content of answer input based on it's index */
  changeAnswer = (e, index, key) => {
    const { shortText, activeElement } = this.props;
    const updatedShortText = { ...shortText };
    updatedShortText[activeElement.id]["answers"][index][key] = e.target.value;
    this.props.updateData("SET_SHORTTEXT", updatedShortText);
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
        item: { id: `${activeElement.id}_shortText_${key}` }
      });
    });
  };

  /* whether to show tag input above each answer input */
  toggleTagAppearance = index => {
    const { activeElement } = this.props;
    const updatedAnswers = [...activeElement.answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      hasTag: updatedAnswers[index]["hasTag"] ? false : true
    };
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      ...activeElement,
      answers: updatedAnswers
    });
  };

  /* when user submits changes */
  submit = () => {
    const { activeElement, newWords } = this.props;
    const isValid = this.validate();

    if (isValid) {
      const elements = activeElement["answers"].map((item, i) => {
        if (item.tag) {
          return {
            ...item,
            tag: activeElement.answers[i]["tag"],
            inputId: activeElement.answers[i]["inputId"]
          };
        } else {
          return { ...item };
        }
      });

      elements.splice(0, 0, {
        value: activeElement.value,
        generalDiscription: activeElement.generalDiscription.trim(),
        id: activeElement.id
      });
      this.props.updateData("SET_FORM_DETAILS", {
        key: activeElement.id,
        details: elements,
        type: "activeDetails"
      });
      this.props.updateData("SHOW_SHORTTEXT", false);
      let words = this.getNewWords();
      words = { ...newWords, ...words };
      this.props.updateData("ADD_NEW_WORD", {
        key: activeElement.id,
        words
      });

      this.props.updateData("SHOW_ERROR", {
        key: "showFormNamelessError",
        value: false
      });
      this.setState({ newWords: {} });
      return;
    }
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  cancel = () => {
    this.props.updateData("SHOW_SHORTTEXT", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: false
    });
  };

  /* add answer input field */
  addAnswer = () => {
    const { activeElement } = this.props;
    const newAnswer = {
      hasTag: false,
      tag: "",
      value: "",
      id: generateRandromString(),
      inputId: ""
    };
    const updatedActiveElement = {
      ...activeElement,
      answers: [...activeElement["answers"], newAnswer]
    };
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", updatedActiveElement);
  };

  /* remove answer field */
  removeAnswer = index => {
    const { activeElement } = this.props;
    if (activeElement["answers"].length > 1) {
      const updatedAnswers = [...activeElement["answers"]];
      updatedAnswers.splice(index, 1);
      this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
        ...activeElement,
        answers: updatedAnswers
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
    const { activeElement } = this.props;

    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      ...activeElement,
      [key]: item.content
    });
    this.closeAutoCompleteOptions();
  };

  /* validate when user submits */
  validate = () => {
    const { activeElement } = this.props;
    let isValid = true;
    //let i = 0;
    if (!activeElement["value"]) {
      isValid = false;
      return isValid;
    }

    // for (i; i < shortText[activeElement.id].length; i++) {
    //   const item = shortText[activeElement.id][i];
    //   if (!item.value) {
    //     isValid = false;
    //     break;
    //   }
    // }
    return isValid;
  };

  changeGeneralDiscription = e => {
    const { activeElement } = this.props;
    if (activeElement["generalDiscription"].length > 3) {
      this.getWords(activeElement["generalDiscription"], "generalDiscription");
    }
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      ...activeElement,
      generalDiscription: e.target.value
    });
  };

  handleChange = (e, key, index) => {
    const { activeElement } = this.props;
    const updatedAnswers = [...activeElement.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [key]: e.target.value };
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      ...activeElement,
      answers: updatedAnswers
    });
  };

  render = () => {
    const {
      language,
      show,
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
            <Translator string="shortText" />
          </div>
          <div className="popup-body">
            <h3>
              {" "}
              <Translator string="shortTextPopupAsk" />{" "}
            </h3>
            <TextareaAutosize
              type="text"
              onChange={this.changeQuestion}
              value={
                activeElement && activeElement.type === "shortText"
                  ? activeElement["value"]
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
                    `${activeElement.id}_shortText_ask`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e =>
                  this.handleAutoCompleteOptionClick(e, "value")
                }
              />
            </div>
            <h3>
              {" "}
              <Translator string="generalDiscription" />{" "}
            </h3>
            <textarea
              type="text"
              onChange={this.changeGeneralDiscription}
              className="input-aria"
              value={
                activeElement && activeElement.type === "shortText"
                  ? activeElement["generalDiscription"]
                  : ""
              }
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
                    `${activeElement.id}_shortText_generalDiscription`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e =>
                  this.handleAutoCompleteOptionClick(e, "generalDiscription")
                }
              />
            </div>
            <h3>
              {" "}
              <Translator string="answers" />{" "}
            </h3>

            <button className="pop-up-button" onClick={this.addAnswer}>
              <Translator string="addAnswer" />
            </button>

            <div className="content-wrapper">
              <div className="title">
                <Translator string="id" />
              </div>
              <div className="title">
                <Translator string="tag" />
              </div>
            </div>
            <div className="input-wrapper">
              {activeElement &&
                activeElement.type === "shortText" &&
                activeElement.answers &&
                activeElement["answers"].map((item, i) => {
                  return (
                    <PopupItem
                      language={language}
                      hasTag={item.hasTag}
                      handleChange={this.handleChange}
                      index={i}
                      value={item.inputId}
                      tag={item.tag}
                      key={item.id}
                      toggleTagAppearance={this.toggleTagAppearance}
                      updateAnswers={() => this.removeAnswer(i)}
                      type="shortText"
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
    show: state.workplacePopups.shortText,

    shortText: state.workplaceElements.shortText,

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

export default connect(mapStateToProps, mapDispatchToProps)(ShortTextPopup);
