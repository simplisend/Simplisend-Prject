import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import {
  PopUp,
  Translator,
  ClickOutsideOptionsList
} from "../../../components/utils";
import { DropDownPopupItem } from "./popupElements";
import titles from "../../../configs/title";
import translator from "../../../funcs/translator";
import messages from "../../../configs/messages";
import { getRequest } from "../../../funcs/http";
import TextareaAutosize from "react-autosize-textarea";


class DropDownPopup extends Component {
  state = { newWords: {} };

  addNewWord = (item, key) => {
    const updatedNewWords = this.state.newWords;
    updatedNewWords[key] = item;
    this.props.updateData({ newWords: updatedNewWords });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { activeElement, dropDowns, autoCompleteOptions } = this.props;
    /* when user openes a new dropdown */

    if (
      activeElement &&
      !dropDowns[activeElement.id] &&
      activeElement.type === "dropList"
    ) {
      this.props.updateData("SET_DROPDOWNS", activeElement.id);
      return;
    }

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

  /* add new dropdown */
  // addDropDown = () => {
  //   const { dropDowns, activeElement } = this.props;
  //   const id = generateRandromString();
  //   const updatedDropdowns = { ...dropDowns };
  //   updatedDropdowns[activeElement.id]["items"].push({
  //     id,
  //     hasTag: false,
  //     tag: "",
  //     title: "",
  //     type: "item",
  //     inputId: "",
  //     itemsCount: 0
  //   });
  //   this.props.updateData("SET_DROPDOWNS", updatedDropdowns);
  // };

  /* get all matching data when user is filling question input */
  getWords = (value,key) => {
    const { selectedForm, activeElement } = this.props;
    const formLanguage = selectedForm.default_lang.id;
    getRequest(
      `text/form_text_contains?lang=${formLanguage}&text=${value}`
    ).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", resp.data);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeAutoCompleteItem",
        item: { id: `${activeElement.id}_dropdown_${key}` }
      });
    });
  };

  getNewWords = () => {
    const { dropDowns, activeElement, selectedForm } = this.props;
    const words = {}; 
  

    words[`${activeElement.id}_ask`] = {
      translation_id: null,
      content: dropDowns[activeElement.id]["ask"]["value"],
      language: selectedForm.default_lang.id
    };

    words[`${activeElement.id}_disc`] = {
      translation_id: null,
      content: dropDowns[activeElement.id]["ask"]["generalDiscription"],
      language: selectedForm.default_lang.id
    };

    dropDowns[activeElement.id]["items"].map((item, index) => {
     
      words[`${activeElement.id}_heading_${index}`] = {
        translation_id: null,
        content: item.title,
        language: selectedForm.default_lang.id
      };
      return null;
    });
    
    return words;
  };

  submit = () => {
    const { activeElement, dropDowns, activeDetails, newWords } = this.props;
    if (!dropDowns[activeElement.id]["ask"]["value"]) {
      this.props.updateData("SHOW_ERROR", {
        key: "showFormNamelessError",
        value: true
      });
      return;
    }

    let updatedDetails;
    let notRemovedDropDowns = {};
    /* if user removed a dropdown i need to know the deleted one */
    dropDowns[activeElement.id]["items"].map(item => {
      notRemovedDropDowns[item.id] = item.id;
      return null;
    });

    /* if dropdown is not a new one */
    if (activeDetails && activeDetails[activeElement.id]) {
      let i = 0;
      /* get all old elements */
      const details = [];

      for (let index in activeDetails[activeElement.id]) {
        const item = activeDetails[activeElement.id][index];
        if (item.type !== "dropdown_option" && notRemovedDropDowns[item.id]) {
          i += 1;
          details.push(item); /* add drop down only if its not deleted */
        } else if (item.type === "dropdown_option") {
          /* add if item is dropdown option */
          details.push(item);
        } else {
          continue;
        }
      }

      /* add the new elements  */
      const updatedDropDowns = dropDowns[activeElement.id]["items"]
        .slice(i)
        .map(item => item);

      /* combine both old and new elements */
      updatedDetails = [
        { value: dropDowns[activeElement.id]["ask"]["value"] },

        //activeDetails[activeElement.id][0] ,
        ...details,
        ...updatedDropDowns
      ];

      /* if the dropdown is new */
    } else {
      const details = dropDowns[activeElement.id]["items"].map(item => {
        return item;
      });
      updatedDetails = [dropDowns[activeElement.id]["ask"]].concat(details);
    }
    updatedDetails[0]["elementId"] = activeElement.id;
    /* add new dropdow element to droppables (if new element )*/
    activeElement.droppableId &&
      this.props.updateData("ADD_ELEMENT_TO_DROPPABLE", {
        key: activeElement.droppableId,
        column: activeElement.column
      });

    /* add elements to active details */
    this.props.updateData("SET_FORM_DETAILS", {
      key: activeElement.id,
      details: updatedDetails,
      type: "activeDetails"
    });

    /* hide the popup */
    this.props.updateData("SHOW_DROPLIST", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: false
    });
    let words = this.getNewWords();
    words = { ...newWords, ...words };
    this.props.updateData("ADD_NEW_WORD", {
      key: activeElement.id,
      words
    });
    this.setState({ newWords: {} });
  };

  /* update ask input */
  handleChange = (e,key) => {
    
    const { activeElement, dropDowns } = this.props;
    const updatedDropdowns = { ...dropDowns[activeElement.id] };
   
    if (updatedDropdowns["ask"][key].length > 3) {
      this.getWords(updatedDropdowns["ask"][key],key);
    }
    updatedDropdowns["ask"][key] = e.target.value;
    this.props.updateData("UPDATE_DROPDOWNS", {
      key: activeElement.id,
      dropDowns: updatedDropdowns
    });
  };

  /* remove a dropdown */
  // removeDropDown = (index) => {
  //
  //   const { dropDowns,activeElement } = this.props;
  //   if (dropDowns[activeElement.id]['items'].length > 1) {
  //
  //     const updatedAnswers = [...dropDowns[activeElement.id]['items']] ;
  //     updatedAnswers.splice(index,1)
  //     const updatedDropDowns = {
  //       ...dropDowns[activeElement.id] ,
  //       items : [...updatedAnswers] ,
  //     } ;
  //
  //     this.props.updateData("UPDATE_DROPDOWNS",
  //     {key : activeElement.id,dropDowns : updatedDropDowns})
  //
  //   }
  //
  // }

  /* update dropdown items*/
  updateItem = (key, index, value) => {
    const { dropDowns, activeElement } = this.props;
    const updatedDropdowns = { ...dropDowns[activeElement.id] };
    updatedDropdowns["items"][index][key] = value;
    this.props.updateData("UPDATE_DROPDOWNS", {
      key: activeElement.id,
      dropDowns: updatedDropdowns
    });
  };

  /* when user clicks cancel button */
  handleCancelClick = () => {
    const { activeElement } = this.props;
    this.props.updateData("REMOVE_DROPDOWNS", activeElement.id);
    this.props.updateData("SHOW_DROPLIST", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: false
    });
  };

  /* when user click on one of auto-complete option */
  handleAutoCompleteOptionClick = (item,key) => {
    const { activeElement, dropDowns } = this.props;
    const updatedDropdowns = { ...dropDowns[activeElement.id] };
    updatedDropdowns["ask"][key] = item.content;
    this.props.updateData("UPDATE_DROPDOWNS", {
      key: activeElement.id,
      dropDowns: updatedDropdowns
    });
    const updatedNewWords = { ...this.state.newWords };
    updatedNewWords[`${activeElement.id}_ask`] = item;
    this.setState({ newWords: updatedNewWords });
    this.closeAutoCompleteOptions();
  };

  /* close autoCompleteOptions (this will remove previous data) */
  closeAutoCompleteOptions = () => {
    this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS_POPUP", false);
    this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", null);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
  };

  render = () => {
    const {
      dropDowns,
      dropList,
      activeElement,
      activeAutoCompleteItem,
      language,
      showFormNamelessError,
      autoCompleteOptions,
      showAutoCompleteOptionsPopup
    } = this.props;
    const error = messages[language]["allFieldsRequired"]["text"];
 
 
    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={dropList}>
          <div className="popup-header">
            <Translator string="dropList" />
          </div>

          <div className="popup-body">
            <h3>
              <Translator string="shortTextPopupAsk" />
            </h3>
            <TextareaAutosize
              value={
                Object.keys(dropDowns).length &&
                activeElement &&
                !activeElement.parentId &&
                dropDowns[activeElement.id]
                  ? dropDowns[activeElement.id]["ask"]["value"]
                  : ""
              }
              className="input-field"
              type="text"
              onChange={(e) => this.handleChange(e,'value')}
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
                    `${activeElement.id}_dropdown_value`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={ e=> this.handleAutoCompleteOptionClick(e,'value')}
              />
            </div>
            {/* ------------------------------------------------- */}
            <h3>
              {" "}
              <Translator string="generalDiscription" />{" "}
            </h3>
            <textarea
              type="text"
              onChange={(e) =>this.handleChange(e,'generalDiscription')}
              className="input-aria"
              value={
                Object.keys(dropDowns).length &&
                activeElement &&
                !activeElement.parentId &&
                dropDowns[activeElement.id]
                  ? dropDowns[activeElement.id]["ask"]["generalDiscription"]
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
                    `${activeElement.id}_dropdown_generalDiscription`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e => this.handleAutoCompleteOptionClick(e,'generalDiscription')}
              />
            </div>
            {/* ------------------------------------------------- */}
            {/*
              <p>
                <button onClick={this.addDropDown}> add </button>
              </p>
              */}

           
            <div className="content-wrapper">
              <div className="title">
                <Translator string="id" />
              </div>

              <div className="title">
                <Translator string="placeholder" />
              </div>

           
            </div>
            {activeElement &&
              dropDowns &&
              dropDowns[activeElement.id] &&
              dropDowns[activeElement.id]["items"].map((item, i) => (
                <DropDownPopupItem
                  key={item.id}
                  hasTag={item.hasTag}
                  tag={item.tag}
                  title={item.title}
                  inputId={item.inputId}
                  handleChange={this.updateItem}
                  index={i}
                  language={language}
                  addNewWord={this.addNewWord}
                  checkIfWordExists={this.checkIfWordExists}
                />
              ))}
          </div>
          <div className="pop-up-bottons-wrapper">
            {showFormNamelessError && <p className="error">{error}</p>}

            <button className="pop-up-button" onClick={this.submit}>
              <Translator string="ok" />
            </button>
            <button className="pop-up-button" onClick={this.handleCancelClick}>
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
    /* render dropdowns */
    dropDowns: state.workplaceElements.dropDowns,

    /* whether to show the popup or not */
    dropList: state.workplacePopups.dropList,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,

    /* for inputs placeholder */
    language: state.lang.lang,

    activeDetails: state.formDetails.activeDetails,
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

//remove = { (index) => this.removeDropDown(i)}
export default connect(mapStateToProps, mapDispatchToProps)(DropDownPopup);
