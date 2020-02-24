import React, { Component } from "react";
import translator from "../../../../funcs/translator";
import titles from "../../../../configs/title";
import { ClickOutsideOptionsList } from "../../../../components/utils";
import { connect } from "react-redux";
import { updateData } from "../../../../store/actions/rootActions";
import { getRequest } from "../../../../funcs/http";

class DropDownItemsBlockPopupItem extends Component {
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
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeAutoCompleteItem",
        item: { id: `${activeElement.id}_option_${index}`, index }
      });
    });
  };

  handleChange = e => {
    const { handleChange, index } = this.props;
    handleChange(e, index);
    if (e.target.value.length >= 3) {
      this.getWords(e.target.value);
    }
  };

  /* when user click on one of auto-complete option */
  handleAutoCompleteOptionClick = item => {
    const { activeElement, dropDownItems, index, addNewWord } = this.props;
    const updatedDropdownItems = [...dropDownItems[activeElement.id]];
    updatedDropdownItems[index]["title"] = item.content;
    this.props.updateData("UPDATE_DROPDOWNS_ITEMS", {
      key: activeElement.id,
      items: updatedDropdownItems
    });
    addNewWord(item, `${activeElement.id}_option_${index}`);
    this.closeAutoCompleteOptions();
  };

  render = () => {
    const {
      index,
      value,
      language,
      remove,
      showAutoCompleteOptionsPopup,
      autoCompleteOptions,
      activeAutoCompleteItem,
      activeElement
    } = this.props;

    return (
      <div className="input-type">
        <div className="tag_Input_1">
          <input
            type="text"
            value={value}
            onChange={this.handleChange}
            placeholder={translator("heading", titles[language])}
          />
          <button onClick={() => remove(index)}> - </button>
        </div>

        <div className="shorttext-options-conainer">
          <ClickOutsideOptionsList
            hide={this.closeAutoCompleteOptions}
            show={
              showAutoCompleteOptionsPopup &&
              activeAutoCompleteItem &&
              activeElement &&
              activeAutoCompleteItem.id ===
                `${activeElement.id}_option_${index}`
            }
            options={autoCompleteOptions ? autoCompleteOptions : []}
            renderKey="content"
            handleClick={this.handleAutoCompleteOptionClick}
          />
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showAutoCompleteOptionsPopup: state.translation.showAutoCompleteOptions,
    selectedForm: state.activeItems.selectedForm,
    activeAutoCompleteItem: state.activeItems.activeAutoCompleteItem,
    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,
    dropDownItems: state.workplaceElements.dropDownItems
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
)(DropDownItemsBlockPopupItem);
