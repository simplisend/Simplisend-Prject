import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { Translator } from "../../components/utils";
import icons from "../../configs/icons";
import FormsListItem from "./formsListItem";
import { request } from "../../funcs/http";
import messages from "../../configs/messages";

class FormsList extends Component {
  state = { messageKey: "confirmDeletion" };

  /* when user clicks on add form buttom */
  handleAddClick = () => {
    const { activeTreeNode } = this.props;
    if (activeTreeNode) {
      this.props.updateData("SHOW_ADD_FORM_POPUP", true);
    }
  };

  /* when user clickes on delete form button */
  handleDeleteClick = () => {
    const { activeForm } = this.props;

    if (activeForm) {
      this.props.updateData("SHOW_FORM_DELETION_POPUP", true);
    }
  };

  /* when user clicks on rename button */
  handleRenameClick = () => {
    const { activeForm, activeTreeNode, activeFormsListTag } = this.props;

    if (activeForm) {
      const key =
        activeTreeNode && activeTreeNode.slug === "root"
          ? "master"
          : `${activeFormsListTag}_${activeTreeNode.id}`;
      this.props.updateData("UPDATE_ACTIVE_FORM", {
        key,
        form: { ...activeForm, isCreated: false }
      });
    }
  };

  /* when user clicks on duplicate button */
  duplicate = () => {
    const { activeForm } = this.props;
    if (activeForm) {
      this.props.updateData("SHOW_ADD_FORM_POPUP", true);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "isDuplicateFormButtonClicked",
        item: true
      });
    }
  };

  /* when user clickes on copy button */
  handleCopyCLick = () => {
    const { activeForm, activeTreeNode, copiedForm } = this.props;
    if (
      activeForm &&
      activeTreeNode &&
      copiedForm &&
      copiedForm.id === activeForm.id
    ) {
      this.props.updateData("FORM_COPY", null);
      return;
    }

    if (activeForm && activeTreeNode) {
      const newItem = { ...activeForm };
      this.props.updateData("FORM_COPY", newItem);
    }
  };

  /* paste form to new tree item */
  paste = () => {
    const {
      activeTreeNode,
      copiedForm,
      activeFormsListTag,
      language
    } = this.props;
    if (activeTreeNode && copiedForm) {
      /* if user pastes the form to the same directory */
      if (activeTreeNode.id === copiedForm.category) {
        this.props.updateData("FORM_COPY", null);
        return;
      }
      const addType =
        activeTreeNode && activeTreeNode.slug === "root"
          ? "master"
          : `${activeFormsListTag}_${activeTreeNode.id}`;
      const removeType =
        copiedForm.category.id === 1
          ? "master"
          : `${copiedForm.type}_${copiedForm.category.id}`;

      const payload = {
        ...copiedForm,
        texts: [],
        type: activeFormsListTag,
        default_lang: copiedForm.default_lang.id,
        parent: activeTreeNode.id,
        category: activeTreeNode.id
      };

      request("forms/cut/", payload, "put")
        .then(resp => {
          const updatedForm = {
            ...resp.data,
            isCreated: true,
            category: { id: resp.data.category },
            default_lang: { id: resp.data.default_lang },
            prevCategory: copiedForm.category
          };
          this.props.updateData("PASTE_FORM", {
            key: addType,
            form: updatedForm
          });
          this.props.updateData("REMOVE_FORM", {
            form: copiedForm,
            key: removeType
          });
          this.props.updateData("FORM_COPY", null);
        })
        .catch(e => {
          const title = messages[language]["error"]["title"];
          const text = messages[language]["error"]["text"];
          this.props.updateData("SET_MESSAGE_DATA", {
            text,
            title,
            showMessage: true
          });

          this.props.updateData("FORM_COPY", null);
          this.props.updateData("SHOW_ERROR_MESSAGE", true);
        });
    }
  };

  render = () => {
    const { activeTreeNode, activeForm, copiedForm } = this.props;
    const cls = activeForm ? "symbol-btn" : "transparent";

    return (
      <div className="list-wrapper">
        <h3 className="tree-title">
          <Translator string="catForms" />
        </h3>
        <div className="buttons-wrapper">
          <button
            className={activeTreeNode ? "symbol-btn" : "transparent"}
            onClick={this.handleAddClick}
          >
            {icons.add}

            <p className="discription">
              <Translator string="add" />
            </p>
          </button>
          <button className={cls} onClick={this.handleRenameClick}>
            {icons.rename}
            <p className="discription">
              <Translator string="rename" />
            </p>
          </button>

          <button className={cls} onClick={this.duplicate}>
            {icons.duplicate}
            <p className="discription">
              <Translator string="duplicate" />
            </p>
          </button>

          <button className={cls} onClick={this.handleCopyCLick}>
            {icons.cut}
            <p className="discription">
              <Translator string="cut" />
            </p>
          </button>

          <button
            className={copiedForm ? "symbol-btn" : "transparent"}
            onClick={this.paste}
          >
            {icons.paste}
            <p className="discription">
              <Translator string="paste" />
            </p>
          </button>
          <button className={cls} onClick={this.handleDeleteClick}>
            {icons.delete}
            <p className="discription">
              <Translator string="delete" />
            </p>
          </button>
        </div>
        {activeTreeNode && <FormsListItem />}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* use it with add, copy ,cut form */
    activeTreeNode: state.saCatsReducer.activeTreeNode,
    /* use it with rename and copy form */
    activeForm: state.saForms.activeForm,

    /* when user copy an item */
    copiedForm: state.saForms.copiedForm,
    /* when past a form decide whether it's form or subform */
    activeFormsListTag: state.activeItems.activeFormsListTag,
    /* to display error message based on language */
    language: state.lang.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsList);
