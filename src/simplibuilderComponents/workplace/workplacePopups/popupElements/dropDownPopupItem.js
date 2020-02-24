import React, { Component } from "react";
import titles from "../../../../configs/title";
import translator from "../../../../funcs/translator";
import { ClickOutsideOptionsList } from "../../../../components/utils";
import { getRequest } from "../../../../funcs/http";
import { connect } from "react-redux";
import { updateData } from "../../../../store/actions/rootActions";

class DropDownPopupItem extends Component {
  /* get all matching data when user is filling question input */
  getWords = (value, key) => {
    const { selectedForm, activeElement, index } = this.props;
    const formLanguage = selectedForm.default_lang.id;
    getRequest(
      `text/form_text_contains?lang=${formLanguage}&text=${value}`
    ).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", resp.data);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeAutoCompleteItem",
        item: { id: `${activeElement.id}_${key}_${index}`, index }
      });
    });
  };

  handleChange = (key, index, value) => {
    const { handleChange } = this.props;
    handleChange(key, index, value);
    if (value.length > 3) {
      this.getWords(value, key);
    }
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

  /* when user click on one of auto-complete option */
  handleAutoCompleteOptionClick = item => {
    const { activeElement, dropDowns, index } = this.props;
    const updatedDropdowns = { ...dropDowns[activeElement.id] };
    updatedDropdowns["items"][index]["title"] = item.content;
    this.props.updateData("UPDATE_DROPDOWNS", {
      key: activeElement.id,
      dropDowns: updatedDropdowns
    });
    this.closeAutoCompleteOptions();
  };

  render = () => {
    const {
      title,
      handleChange,
      index,
      language,
      activeAutoCompleteItem,
      inputId,
      showAutoCompleteOptionsPopup,
      autoCompleteOptions,
      activeElement
    } = this.props;

    return (
      <div className="input-wrapper">
        <div className="input-type">
          <div className="id-Input">
            <input
              value={inputId}
              type="text"
              onChange={e => handleChange("inputId", index, e.target.value)}
              placeholder={translator(
                "shortTextPopupPlaceholder",
                titles[language]
              )}
            />
          </div>

          <div className="tag-Input">
            <input
              value={title}
              type="text"
              onChange={e => this.handleChange("title", index, e.target.value)}
              placeholder={translator("placeholder", titles[language])}
            />

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_title_${index}`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={this.handleAutoCompleteOptionClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
}
//<button onClick = {() => remove()}> - </button>

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    activeAutoCompleteItem: state.activeItems.activeAutoCompleteItem,
    showAutoCompleteOptionsPopup: state.translation.showAutoCompleteOptions,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    selectedForm: state.activeItems.selectedForm,
    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,
    /* render dropdowns */
    dropDowns: state.workplaceElements.dropDowns
  };
};
//
// <input
//   type = 'checkbox'
//   checked = { hasTag }
//   onChange = {(e) => handleChange('hasTag',index,hasTag ? false : true )}
// />

// {
//   hasTag &&
//   <div>
//     <p>
//       <input
//         value = { tag }
//         type = 'text'
//         onChange = { (e) => this.handleChange('tag',index,e.target.value)}
//         placeholder = {translator('tag',titles[language])}
//       />
//     </p>
//     <div className = 'shorttext-options-conainer'>
//       <ClickOutsideOptionsList
//         hide = {this.closeAutoCompleteOptions}
//         show = {
//           showAutoCompleteOptionsPopup &&
//           activeAutoCompleteItem &&
//           activeAutoCompleteItem.id === `${activeElement.id}_tag_${index}`
//
//         }
//         options = { autoCompleteOptions ? autoCompleteOptions : [] }
//         renderKey = 'content'
//         handleClick = {this.handleAutoCompleteOptionClick}
//       />
//     </div>
//   </div>
// }
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropDownPopupItem);
