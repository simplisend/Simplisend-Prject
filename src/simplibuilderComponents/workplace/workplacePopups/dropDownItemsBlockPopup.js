import React, { Component } from "react";
import { connect } from "react-redux";
import { PopUp, Translator } from "../../../components/utils";
import generateRandromString from "../../../funcs/generateRandromString";
import { updateData } from "../../../store/actions/rootActions";
import { DropDownItemsBlockPopupItem } from "./popupElements";
import messages from "../../../configs/messages";
import titles from "../../../configs/title";
import translator from "../../../funcs/translator";

class DropDownItemsBlockPopup extends Component {
  state = { newWords: {} };

  addNewWord = (item, key) => {
    const updatedNewWords = this.state.newWords;
    updatedNewWords[key] = item;
    this.props.updateData({ newWords: updatedNewWords });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { activeElement, dropDownItems } = this.props;

    if (activeElement && !dropDownItems[activeElement.id]) {
      if (!prevProps.activeElement && activeElement && activeElement.parentId) {
        this.props.updateData("SET_DROPDOWN_ITEMS", activeElement.id);
        return;
      }

      if (
        prevProps.activeElement &&
        activeElement &&
        prevProps.activeElement.id !== activeElement.id
      ) {
        this.props.updateData("SET_DROPDOWN_ITEMS", activeElement.id);
      }
    }
  };

  /* validate all input when user submits */
  validate = () => {
    const { dropDownItems, activeElement } = this.props;
    let isValid = true;
    let i = 0;

    for (i; i < dropDownItems[activeElement.id].length; i++) {
      const item = dropDownItems[activeElement.id][i];
      if (!item.title) {
        isValid = false;
        break;
      }
    }

    return isValid;
  };

  /* add new item to an exsisting dropdown */
  addItem = () => {
    const { dropDownItems, activeElement } = this.props;
    const updatedDropDownItems = [
      ...dropDownItems[activeElement.id],
      {
        id: generateRandromString(),
        parent: activeElement.id,
        type: "dropdown_option",
        title: ""
      }
    ];
    this.props.updateData("UPDATE_DROPDOWNS_ITEMS", {
      key: activeElement.id,
      items: updatedDropDownItems
    });
  };

  /* remove and item from an exsisting dropdown */
  removeItem = index => {
    const { dropDownItems, activeElement } = this.props;
    const updatedDropDownItems = [...dropDownItems[activeElement.id]];
    if (updatedDropDownItems.length > 1) {
      updatedDropDownItems.splice(index, 1);
      this.props.updateData("SET_DROPDOWN_ITEMS", {
        key: activeElement.id,
        items: updatedDropDownItems
      });
    }
  };

  handleCancelClick = () => {
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
    this.props.updateData("SHOW_DROPLIST_DETAILS", false);
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: false
    });
  };

  getNewWords = () => {
    const { dropDownItems, activeElement, selectedForm } = this.props;
    const words = {};
    dropDownItems[activeElement.id].map((item, i) => {
      words[`${activeElement.id}_option_${i}`] = {
        content: item.title,
        translation_id: null,
        language: selectedForm.default_lang.id
      };
      return null;
    });
    words[`${activeElement.id}_tag`] = {
      content : activeElement.tag , 
      translation_id : null , 
      language : selectedForm.default_lang.id 
    } 
    return words;
  };

  submit = () => {
    const {
      activeDetails,
      activeElement,
      dropDownItems,
      newWords
    } = this.props;
    const isValid = this.validate();
    let updatedDetails;

    if (isValid) {
      const elements = dropDownItems[activeElement.id].map((item, i) => ({
        id: item.id,
        title: item.title,
        index: i,
        type: item.type
      }));

      const itemsCount =
        activeDetails[activeElement.parentId][activeElement.index][
          "itemsCount"
        ];

      if (itemsCount === 0) {
        updatedDetails = [
          ...activeDetails[activeElement.parentId].slice(
            0,
            activeElement.index + 1
          ),
          ...elements,
          ...activeDetails[activeElement.parentId].slice(
            activeElement.index + 1
          )
        ];
        updatedDetails[1]["hasTag"] = activeElement.hasTag;
        updatedDetails[1]["tag"] = activeElement.tag;
      } else {
        const part = activeDetails[activeElement.parentId]
          .slice(0, activeElement.index + 1)
          .map(item => {
            if (item.inputId) {
              return {
                ...item,
                hasTag: activeElement.hasTag,
                tag: activeElement.tag
              };
            }
            return { ...item, hasTag: activeElement.hasTag };
          });

        //console.log(part);onsole.log(part);

        updatedDetails = [
          ...part,
          ...elements,
          ...activeDetails[activeElement.parentId].slice(
            itemsCount + part.length
          )
        ];
      }

      updatedDetails[activeElement.index]["itemsCount"] = elements.length;

      /* apply the new elements to formBuilder page */
      this.props.updateData("SET_FORM_DETAILS", {
        key: activeElement.parentId,
        details: updatedDetails,
        type: "activeDetails"
      });
      /* hide popup */
      this.props.updateData("SHOW_DROPLIST_DETAILS", false);

      /* set active popup to none*/
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
      return;
    }
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
  };

  /* change content for dropdown items inputs */
  updateItem = (e, index) => {
    const { dropDownItems, activeElement } = this.props;
    const updatedDropDownItem = [...dropDownItems[activeElement.id]];
    updatedDropDownItem[index]["title"] = e.target.value;
    this.props.updateData("UPDATE_DROPDOWNS_ITEMS", {
      key: activeElement.id,
      items: updatedDropDownItem
    });
  };

  toggleCheck = () => {
    const { activeElement } = this.props;
    const updatedActiveElement = {
      ...activeElement,
      hasTag: !activeElement.hasTag
    };

    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", updatedActiveElement);
  };

  handleTagChange = e => {
    const { activeElement } = this.props;
    const updatedActiveElement = { ...activeElement, tag: e.target.value };
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", updatedActiveElement);
  };

  render = () => {
    const {
      show,
      activeElement,
      dropDownItems,
      language,
      showFormNamelessError
    } = this.props;

    const error = messages[language]["allFieldsRequired"]["text"];

    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={show}>
          <div className="popup-header">
            {activeElement && activeElement.title}
          </div>

          <div className="popup-body">
            <h3>
              <Translator string="options" />
            </h3>
            {activeElement && (
              <div className="flex-horizontal">
                <input
                  value={activeElement.tag}
                  type="text"
                  onChange={this.handleTagChange}
                  placeholder={translator("tag", titles[language])}
                />
                <input
                  type="checkbox"
                  onChange={this.toggleCheck}
                  checked={activeElement.hasTag}
                />
              </div>
            )}

            <button className="pop-up-button" onClick={this.addItem}>
              <Translator string="add" />
            </button>

            <div className="content-wrapper">
              <div className="title">
                <Translator string="heading" />
              </div>
            </div>
            <div className="input-wrapper">
              {dropDownItems &&
                activeElement &&
                dropDownItems[activeElement.id] &&
                dropDownItems[activeElement.id].map((item, i) => {
                  return (
                    <DropDownItemsBlockPopupItem
                      handleChange={this.updateItem}
                      index={i}
                      value={dropDownItems[activeElement.id][i]["title"]}
                      language={language}
                      remove={this.removeItem}
                      key={item.id}
                      addNewWord={this.addNewWord}
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
    /* whether to show this popup or not */
    show: state.workplacePopups.dropListDetails,
    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,
    dropDownItems: state.workplaceElements.dropDownItems,
    /* show error message based on language */
    language: state.lang.lang,
    /* when user submits get all old options (if any )*/
    activeDetails: state.formDetails.activeDetails,
    /* if user submits without filling input fields */
    showFormNamelessError: state.messages.showFormNamelessError,
    selectedForm: state.activeItems.selectedForm,
    newWords: state.translation.newWords
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
)(DropDownItemsBlockPopup);
