import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { request } from "../../funcs/http";
import icons from "../../configs/icons";
import messages from "../../configs/messages";
import { ClickOutsideComponent } from "../../components/utils";

class FormItem extends Component {
  state = { title: this.props.item.title };

  handleChange = e => this.setState({ title: e.target.value });

  handleKeyPress = e => {
    if (e.key === "Enter" && this.state.title) {
      this.renameForm();
    }
  };

  renameForm = () => {
    const {
      activeForm,
      activeTreeNode,
      language,
      activeFormsListTag
    } = this.props;

    const payload = {
      ...activeForm,
      title: this.state.title,
      default_lang: activeForm.default_lang.id,
      texts:
        this.state.title !== activeForm.title
          ? [
              {
                content: this.state.title,
                language: activeForm.default_lang.id,
                translation_id: null
              }
            ]
          : [],
      category: activeForm.category.id
    };
    payload["data"] && delete payload["data"];
    request(`forms/${activeForm.slug}/`, payload, "PUT")
      .then(resp => {
        const key =
          activeTreeNode && activeTreeNode.slug === "root"
            ? "master"
            : `${activeFormsListTag}_${activeTreeNode.id}`;

        this.props.updateData("UPDATE_ACTIVE_FORM", {
          key,
          form: {
            ...resp.data,
            default_lang: { id: resp.data.default_lang },
            isCreated: true,
            index: activeForm.index,
            category: { id: activeTreeNode.id }
          }
        });
      })
      .catch(e => {
        const title = messages[language]["error"]["title"];
        const text = messages[language]["error"]["text"];
        this.props.updateData("SET_MESSAGE_DATA", {
          text,
          title,
          showMessage: true
        });
      });
  };

  toggleActiveForm = () => {
    const { activeForm, item } = this.props;
    if (!activeForm) {
      this.props.updateData("SET_ACTIVE_FORM", item);
      return;
    }
    this.props.updateData("SET_ACTIVE_FORM", item);
  };

  render = () => {
    const { item, activeForm, copiedForm } = this.props;
    let cls = activeForm && item.id === activeForm.id ? "active" : "form";
    if (activeForm && copiedForm && item.id === copiedForm.id) {
      cls += " cuted_item";
    }
    return (
      <div
        className={cls}
        key={item.id}
        onClick={this.toggleActiveForm}
        ref={node => (this.node = node)}
      >
        <p className={item.type === "form" ? "form-item" : "s-form-item"}>
          {icons.form}
        </p>
        <div className="form-title">
          {item.isCreated && item.title}
          {!item.isCreated && (
            <ClickOutsideComponent
              condition={activeForm && !item.isCreated}
              handleClick={this.renameForm}
            >
              <input
                type="text"
                value={this.state.title}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                autoFocus={true}
                className="rename"
              />
            </ClickOutsideComponent>
          )}
        </div>
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
    activeForm: state.saForms.activeForm,
    /*
      when renaming i need to send activeTreeNode so i can decide which form list item is active
      (master , form ,sub-form)
    */
    activeTreeNode: state.saCatsReducer.activeTreeNode,
    /* to display error message based on language */
    language: state.lang.lang,
    copiedForm: state.saForms.copiedForm,
    activeFormsListTag: state.activeItems.activeFormsListTag
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormItem);
