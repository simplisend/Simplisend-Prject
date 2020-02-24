import React, { Component } from "react";
import { getRequest } from "../../../funcs/http";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import TextareaAutosize from "react-autosize-textarea";

class TextItem extends Component {
  getWords = () => {
    const { value, selectedForm, id, index } = this.props;
    const formLanguage = selectedForm.default_lang.id;
    getRequest(
      `text/form_text_contains?lang=${formLanguage}&text=${value}`
    ).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", resp.data);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "autoCompleteActiveItem",
        item: { id, index }
      });
    });
  };

  handleChange = e => {
    const { handleChange, value } = this.props;
    handleChange(e);
    if (value.length >= 3) {
      this.getWords();
    }
  };

  render = () => {
    /*
      value : a text to render
      handleChange  : when changing content of input
      autoFocus : whether input should be auto focused or not
      edit : in which mode text item is now (editable or normal)
      activate : a function to trigger editable mode
      cls : className
    */
    const { value, autoFocus, edit, activate, cls, selected } = this.props;
    const selectedBtnActive = selected.indexOf("btn-Requierd") !== -1;
    return (
      <div
        onClick={() => activate()}
        style={{ cursor: selectedBtnActive ? "pointer" : "default" }}
      >
        <div
          style={{
            pointerEvents: selectedBtnActive ? "none" : "auto"
          }}
        >
          {edit && (
            <TextareaAutosize
              value={value}
              type="text"
              onChange={this.handleChange}
              autoFocus={autoFocus}
              className={cls}
              onKeyPress={e => this.props.handleKeyPress(e)}
              maxRows={3}
            />
          )}
        </div>

        {!edit && <p className={cls}>{value}</p>}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    selectedForm: state.activeItems.selectedForm,
    /* which header buttons is selected now*/
    selected: state.formToolBar.selected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(TextItem);
