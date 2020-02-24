import React, { Component } from "react";
import { ClickOutsideComponent } from "../../components/utils";
import { connect } from "react-redux";
import TextareaAutosize from "react-autosize-textarea";
import { updateData } from "../../store/actions/rootActions";
import { request } from "../../funcs/http";

class TranslationListItem extends Component {
  /* change translationListItem content */
  handleChange = e => {
    const { activeTranslationTableItem } = this.props;
    const updatedActiveTranslationTableItem = {
      ...activeTranslationTableItem,
      value: e.target.value
    };
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeTranslationTableItem",
      item: updatedActiveTranslationTableItem
    });
  };

  handleKeyPress = e => {
    const { activeTranslationTableItem, id } = this.props;
    if (
      e.key === "Enter" &&
      activeTranslationTableItem &&
      activeTranslationTableItem.id === id
    ) {
      this.save();
    }
  };

  /* when user clicks outside translationTableItem */
  handleClick = () => {
    this.save();
  };

  /* when user wants to save a translation to  a sentence */
  saveTranslation = () => {
    const {
      activeForm,
      activeTranslationTableItem,
      searchedLang,
      orderedWords
    } = this.props;

    if (activeTranslationTableItem.value) {
      const payload = {
        form: activeForm.id,
        content: activeTranslationTableItem.value,
        language: searchedLang.id,
        translation_id: activeTranslationTableItem.translation_id
      };
      request("text/", payload).then(resp => {
        const updatedOrderdWords = {
          ...orderedWords[`${activeForm.id}_${searchedLang.id}`]
        };
        updatedOrderdWords[payload.translation_id] = resp.data;
        this.props.updateData("SET_ORDERED_WORDS", {
          key: `${activeForm.id}_${searchedLang.id}`,
          words: updatedOrderdWords
        });
        this.props.updateData("SET_ACTIVE_ITEM", {
          key: "activeTranslationTableItem",
          item: null
        });
      });
    }
  };

  /* update translation for a sentence */
  updateTranslation = () => {
    const {
      activeForm,
      activeTranslationTableItem,
      searchedLang,
      orderedWords,
      id
    } = this.props;
  
    if (activeTranslationTableItem.value) {
      const payload = {
        form: activeForm.id,
        content: activeTranslationTableItem.value,
        language: searchedLang.id,
        translation_id: activeTranslationTableItem.translation_id
      };
      request(`text/${id}/`, payload, "put").then(resp => {
        const updatedOrderdWords = {
          ...orderedWords[`${activeForm.id}_${searchedLang.id}`]
        };
        updatedOrderdWords[payload.translation_id] = resp.data;
        this.props.updateData("SET_ORDERED_WORDS", {
          key: `${activeForm.id}_${searchedLang.id}`,
          words: updatedOrderdWords
        });
        this.props.updateData("SET_ACTIVE_ITEM", {
          key: "activeTranslationTableItem",
          item: null
        });
      });
    }
  };

  /* wrap save login in one method */
  save = () => {
    const { activeTranslationTableItem } = this.props;
    if (activeTranslationTableItem.language) {
      this.updateTranslation();
      return;
    }

    this.saveTranslation();
  };

  /* when user clicks on translation table item */
  activate = () => {
    const { id, content, translation_id, language } = this.props;
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeTranslationTableItem",
      item: { id, value: content, translation_id, language }
    });
  };

  render = () => {
    const { content, id, activeTranslationTableItem } = this.props;
    const cls =
      activeTranslationTableItem && activeTranslationTableItem.id === id
        ? "active-item"
        : "list-item";

    return (
      <div className={cls} onClick={this.activate}>
        <ClickOutsideComponent
          condition={
            activeTranslationTableItem && activeTranslationTableItem.id === id
          }
          handleClick={this.handleClick}
        >
          {activeTranslationTableItem && activeTranslationTableItem.id === id && (
            <div className="input-wrapper">
              <TextareaAutosize
                type="text"
                value={
                  activeTranslationTableItem &&
                  activeTranslationTableItem.id === id
                    ? activeTranslationTableItem.value
                    : content
                }
                className="input-field"
                autoFocus={true}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
            </div>
          )}

          {!activeTranslationTableItem && <p>{content}</p>}
          {activeTranslationTableItem &&
            activeTranslationTableItem.id !== id && <p>{content}</p>}
        </ClickOutsideComponent>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    activeTranslationTableItem: state.activeItems.activeTranslationTableItem,
    activeForm: state.saForms.activeForm,
    orderedWords: state.translation.orderedWords,
    searchedLang: state.translation.searchedLang
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslationListItem);
