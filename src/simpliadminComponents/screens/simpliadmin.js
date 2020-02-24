import React, { Component, Fragment } from "react";
import { Header, Footer } from "../layout";
import { BodyWrapper } from "../layout";
import { PopUp } from "../../components/utils";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { generateRandromString } from "../../funcs";
import { Translator } from "../../components/utils";
import messages from "../../configs/messages";
import { request, deleteRequest } from "../../funcs/http";
import Select from "react-select";
import { getRequest } from "../../funcs/http";
import StaticPage from "../../simplisendComponents/workplace/staticPage";

/* use this function to find the first tag when adding a new filter */
const findFistTypeNode = (seq, type) => {
  if (!seq.length) {
    return 1;
  }

  let found = false;
  let result;
  let i = seq.length - 1;
  while (i > -1 && !found) {
    if (seq[i].type === type) {
      found = true;
      result = seq[i]["id"];
    }
    i -= 1;
  }

  return result;
};

class Simpliadmin extends Component {
  state = {
    checked: "cat",
    name: "",
    formTitle: "",
    selectedLang: null,
    options: null
  };

  componentWillMount = () => {
    this.props.updateData("TOGGLE_STARTER_SCREEN", true);
    this.props.updateData("SHOW_BUTTONS", false);
    this.props.updateData("SET_ACTIVE_FORM", null);
    this.props.updateData("SIDEBAR_TITLE", "");
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderActive",
      item: false
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderNavButtonClicked",
      item: false
    });
    this.props.updateData("SET_ACTIVE_TREE_NODE", {
      slug: "root",
      title: "root",
      id: 1,
      isCreated: true,
      index: 0,
      type: "tag",
      show: true,
      level: 1
    });
  };

  changeLanguage = langKey => {
    localStorage.setItem("lang", langKey);
    this.props.updateData("LANG", langKey);
  };

  hidePopup = () => {
    this.props.updateData("SHOW_CAT_OPTIONS_POPUP", false);
    this.setState({ name: "" });
    this.props.updateData("SS_SHOW_LANG-CHOISE", false);
  };

  handleChange = (e, k) => this.setState({ [k]: e.target.value });

  componentDidMount = () => {
    /* get all languages */
    getRequest("langs").then(resp => {
      const options = resp.data.map(item => {
        return { label: item.symbol, value: item.id };
      });
      this.setState({ options });
    });
  };

  /*
        wrapps all remove methods
       this method will trigger the right behavior based on the deleted item type
      */
  removeItem = () => {
    const { activeTreeNode } = this.props;
    deleteRequest(`tree/${activeTreeNode.id}/`).then(resp => {
      if (resp.status === 200) {
        this.props.updateData("SET_FORMS", { key: "all", forms: resp.data });
        const typ =
          activeTreeNode.type === "tag" ? "REMOVE_TAG" : "REMOVE_ITEM";
        if (typ === "REMOVE_TAG") {
          this.props.updateData("UPDATE_SELECTED_BUTTONS", activeTreeNode);
          this.props.updateData("SS_HEADER_ACTIVE", "1");
        }
        this.props.updateData(typ, activeTreeNode);
        this.props.updateData("SHOW_CAT_DELETION_MESSAGE", false);
      }
    });
  };

  removeForm = () => {
    const { activeForm, activeTreeNode, activeFormsListTag } = this.props;
    const type =
      activeTreeNode && activeTreeNode.slug === "root"
        ? "master"
        : `${activeFormsListTag}_${activeTreeNode.id}`;
    if (activeForm) {
      deleteRequest(`forms/${activeForm.slug}`).then(resp => {
        this.props.updateData("REMOVE_FORM", { form: activeForm, key: type });
        this.props.updateData("SHOW_FORM_DELETION_POPUP", false);
      });
    }
  };

  /* set form language */
  selecteLanguage = selectedOption => {
    this.setState({ selectedLang: selectedOption.value });
  };

  /* when user submits form addition */
  validate = () => {
    const pattern = /^[a-zA-Z]+.*$/;
    const { formTitle, selectedLang } = this.state;
    const { isDuplicateFormButtonClicked } = this.props;
    if (isDuplicateFormButtonClicked) {
      if (!formTitle.match(pattern)) {
        return false;
      }
      return true;
    } else {
      if (!formTitle.match(pattern) || !selectedLang) {
        return false;
      }
      return true;
    }
  };

  duplicateForm = () => {
    const {
      activeForm,
      activeTreeNode,
      activeFormsListTag,
      language
    } = this.props;
    const { formTitle } = this.state;
    const payload = {
      title: formTitle,
      default_lang: activeForm.default_lang.id,
      category: activeForm.category.id,
      type: activeForm.type,
      texts: [],
      is_empty: activeForm.is_empty,
      date: activeForm.date,
      slug: activeForm.slug,
      url: activeForm.elements
    };

    this.props.updateData("SHOW_ADD_FORM_POPUP", false);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isDuplicateFormButtonClicked",
      item: false
    });

    request("forms/copy/", payload)
      .then(resp => {
        const key =
          activeTreeNode && activeTreeNode.slug === "root"
            ? "master"
            : `${activeFormsListTag}_${activeTreeNode.id}`;
        this.setState({ formTitle: "" });

        const form = {
          ...resp.data,
          isCreated: true,
          category: { id: resp.data.category },
          default_lang: { id: resp.data.default_lang },
          is_empty: resp.data.is_empty === null ? true : resp.data.is_empty
        };

        this.props.updateData("ADD_FORM", { key, form });
      })
      .catch(e => {
        const text = messages[language]["error"]["text"];
        const title = messages[language]["error"]["title"];
        this.props.updateData("SET_MESSAGE_DATA", {
          title,
          text,
          showMessage: true
        });
      });
  };

  createNewForm = () => {
    const { isDuplicateFormButtonClicked } = this.props;
    const isValid = this.validate();
    if (isValid) {
      if (!isDuplicateFormButtonClicked) {
        this.addForm();
        return;
      }
      this.duplicateForm();
      return;
    }
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
  };

  /* add new form */
  addForm = () => {
    const { formTitle, selectedLang } = this.state;
    const { activeTreeNode, activeFormsListTag, language } = this.props;

    let type = "form";
    if (activeFormsListTag === "sub-form" && activeTreeNode.slug !== "root") {
      type = "sub-form";
    }

    this.props.updateData("SHOW_ADD_FORM_POPUP", false);
    const payload = {
      title: formTitle,
      category: activeTreeNode.id,
      default_lang: selectedLang,
      data: JSON.stringify({ elements: {}, details: {} }),
      type: type,
      texts: [{ content: formTitle, language: selectedLang }],
      is_empty: true
    };

    const key =
      activeTreeNode && activeTreeNode.slug === "root"
        ? "master"
        : `${activeFormsListTag}_${activeTreeNode.id}`;

    request("forms/", payload)
      .then(resp => {
        this.setState({ formTitle: "", selectedLang: null });
        const form = {
          ...resp.data,
          isCreated: true,
          category: { id: resp.data.category },
          default_lang: { id: resp.data.default_lang },
          is_empty: resp.data.is_empty === null ? true : resp.data.is_empty
        };
        this.props.updateData("ADD_FORM", { key, form });
        this.props.updateData("SHOW_ERROR", {
          key: "showFormNamelessError",
          value: false
        });
      })
      .catch(e => {
        const text = messages[language]["error"]["text"];
        const title = messages[language]["error"]["title"];
        this.props.updateData("SET_MESSAGE_DATA", {
          title,
          text,
          showMessage: true
        });
      });
  };

  /* add new category (new item to the tree )*/
  addItem = () => {
    const { activeTreeNode, tree } = this.props;

    const type = this.state.checked;
    const name = this.state.name;

    if (type && name) {
      const payload = {
        title: name,
        type,
        level: activeTreeNode.level + 1,
        parent: activeTreeNode.id,
        slug: generateRandromString(),
        can_have_filters: true
      };

      if (
        activeTreeNode.type === "filter" ||
        activeTreeNode.type === "sub-filter" ||
        (!activeTreeNode.canHaveFilters && !activeTreeNode.can_have_filters)
      ) {
        payload["can_have_filters"] = false;
      }

      /*if the new item is filter then add the id of the tag it belongs to */
      if (type === "filter") {
        const parentId = findFistTypeNode(
          [...tree.slice(0, activeTreeNode.index + 1)],
          "tag"
        );
        payload["parent_tag"] = parentId;
      }

      this.hidePopup();
      request("tree/", payload)
        .then(resp => {
          if (resp.status === 201) {
            const newItem = {
              ...resp.data,
              index: tree.length,
              isCreated: true,
              parentIndex: activeTreeNode.index,
              canHaveFilters: resp.data.can_have_filters,
              show: true,
              isOpened: true
            };

            this.props.updateData(`add_${type}`.toUpperCase(), newItem);
            this.setState({ checked: "cat" });
            return;
          }
        })
        .catch(e => {
          this.props.updateData("SET_MESSAGE_DATA", {
            title: "Error !",
            text: "An error occured so the process couldnt complete",
            showMessage: true
          });

          return;
        });
    }
  };

  render = () => {
    const {
      activeTreeNode,
      language,
      showLangChoice,
      showDeletionMessage,
      showMessage,
      showProcessing,
      messageTitle,
      messageText,
      showAddFormPopup,
      showFormDeletionMessage,
      isDuplicateFormButtonClicked,
      showFormNamelessError,
      formDeletionMessageKey,
      activeStaticPage,
      isLayoutClassChanged
    } = this.props;

    const error = messages[language]["invalidFormName"]["text"];
    const messageData = messages[language][formDeletionMessageKey];

    return (
      <div className={isLayoutClassChanged ? "sa-layout-0" : "sa-layout-1"}>
        <BodyWrapper history={this.props.history} {...this.props} />
        {activeStaticPage && <StaticPage />}
        <Header domainTitle="admin" />

        <Footer />

        <div className="sa-main-popup-wrapper">
          <PopUp show={this.props.showOptions}>
            <div className="popup-header">
              <Translator string="addNewFolder" />
            </div>
            <div className="popup-body">
              <h3>
                <Translator string="selectTypeHeading" />
              </h3>
              {activeTreeNode && (
                <div className="radio-wrapper">
                  {activeTreeNode.slug === "root" && (
                    <Fragment>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="cat"
                          checked={this.state.checked === "cat"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                        <Translator string="category" />
                      </div>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="tag"
                          checked={this.state.checked === "tag"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                        <Translator string="tag" />
                      </div>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="filter"
                          checked={this.state.checked === "filter"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                        <Translator string="filter" />
                      </div>
                    </Fragment>
                  )}

                  {activeTreeNode.type === "filter" && (
                    <Fragment>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="sub-filter"
                          checked={this.state.checked === "sub-filter"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                        <Translator string="subFilter" />
                      </div>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="cat"
                          checked={this.state.checked === "cat"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                        <Translator string="category" />
                      </div>
                    </Fragment>
                  )}

                  {activeTreeNode.type === "sub-filter" && (
                    <Fragment>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="cat"
                          checked={this.state.checked === "cat"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                      </div>
                      <Translator string="category" />
                    </Fragment>
                  )}
                  {activeTreeNode.type === "tag" &&
                    activeTreeNode.slug !== "root" && (
                      <Fragment>
                        <div className="radio-item">
                          <input
                            className="radio"
                            type="radio"
                            name="type"
                            value="cat"
                            checked={this.state.checked === "cat"}
                            onChange={(e, k) => this.handleChange(e, "checked")}
                          />
                          <Translator string="category" />
                        </div>
                        <div className="radio-item">
                          <input
                            className="radio"
                            type="radio"
                            name="type"
                            value="filter"
                            checked={this.state.checked === "filter"}
                            onChange={(e, k) => this.handleChange(e, "checked")}
                          />
                          <Translator string="filter" />
                        </div>
                      </Fragment>
                    )}

                  {activeTreeNode.type === "cat" && (
                    <Fragment>
                      <div className="radio-item">
                        <input
                          className="radio"
                          type="radio"
                          name="type"
                          value="cat"
                          checked={this.state.checked === "cat"}
                          onChange={(e, k) => this.handleChange(e, "checked")}
                        />
                        <Translator string="category" />
                      </div>
                      {activeTreeNode.canHaveFilters && (
                        <div className="radio-item">
                          <input
                            className="radio"
                            type="radio"
                            name="type"
                            value="filter"
                            checked={this.state.checked === "filter"}
                            onChange={(e, k) => this.handleChange(e, "checked")}
                          />
                          <Translator string="filter" />
                        </div>
                      )}
                    </Fragment>
                  )}
                </div>
              )}
              <h3>
                <Translator string="addFolderName" />
              </h3>

              <input
                className="input-field"
                type="text"
                onChange={(e, k) => this.handleChange(e, "name")}
                value={this.state.name}
              />
            </div>
            <div className="pop-up-bottons-wrapper">
              <button className="pop-up-button" onClick={this.hidePopup}>
                <Translator string="cancel" />
              </button>
              <button className="pop-up-button" onClick={this.addItem}>
                <Translator string="add" />
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sa-main-popup-wrapper">
          <PopUp show={showDeletionMessage}>
            <div className="popup-header">{messageData["title"]}</div>
            <div className="popup-body">
              <div className="massage">{messageData["text"]}</div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() =>
                  this.props.updateData("SHOW_CAT_DELETION_MESSAGE", false)
                }
              >
                Cancel
              </button>
              <button className="pop-up-button" onClick={this.removeItem}>
                Confirm
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sa-main-popup-wrapper">
          <PopUp show={showFormDeletionMessage}>
            <div className="popup-header">{messageData["title"]}</div>
            <div className="popup-body">
              <div className="massage">{messageData["text"]}</div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() =>
                  this.props.updateData("SHOW_FORM_DELETION_POPUP", false)
                }
              >
                Cancel
              </button>
              <button className="pop-up-button" onClick={this.removeForm}>
                Confirm
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sa-main-popup-wrapper">
          <PopUp show={showMessage}>
            <div className="popup-header">{messageTitle}</div>
            <div className="popup-body">
              <div className="massage">{messageText}</div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() =>
                  this.props.updateData("SET_MESSAGE_DATA", {
                    title: "",
                    text: "",

                    showMessage: false
                  })
                }
              >
                <Translator string="ok" />
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sa-main-popup-wrapper">
          <PopUp show={showAddFormPopup}>
            <div className="popup-header">
              <Translator string="addNewForm" />
            </div>
            <div className="popup-body">
              {showFormNamelessError && <p className="error">{error}</p>}
              <h3>
                <Translator string="addFormHeading" />
              </h3>
              <input
                className="input-field"
                type="text"
                value={this.state.formTitle}
                onChange={(e, k) => this.handleChange(e, "formTitle")}
              />

              {showFormNamelessError && <p className="error"> * </p>}

              {this.state.options && !isDuplicateFormButtonClicked && (
                <h3>
                  <Translator string="chooseLanguage" />
                </h3>
              )}
              {this.state.options && !isDuplicateFormButtonClicked && (
                <Select
                  options={this.state.options}
                  onChange={this.selecteLanguage}
                />
              )}
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SHOW_ADD_FORM_POPUP", false);
                  this.props.updateData("SET_ACTIVE_ITEM", {
                    key: "isDuplicateFormButtonClicked",
                    item: false
                  });
                  this.props.updateData("SHOW_ERROR", {
                    key: "showFormNamelessError",
                    value: false
                  });
                }}
              >
                <Translator string="cancel" />
              </button>
              <button className="pop-up-button" onClick={this.createNewForm}>
                <Translator string="add" />
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sa-main-popup-wrapper">
          <PopUp show={showProcessing}>
            <div className="proccessing">
              <Translator string="processing" />
            </div>
          </PopUp>
        </div>
        <div className="sa-main-popup-wrapper">
          <PopUp show={showLangChoice}>
            <div className="popup-header">Select Lnaguage</div>
            {/* pop-up body wrapper  */}
            <div className="popup-body">
              <div
                className="langList"
                onClick={() => this.changeLanguage("ar")}
              >
                Arabic
              </div>
              <div
                className="langList"
                onClick={() => this.changeLanguage("gr")}
              >
                Deutsch
              </div>
              <div
                className="langList"
                onClick={() => this.changeLanguage("en")}
              >
                Englisch
              </div>
            </div>
            {/* pop-up buttons */}
            <div className="pop-up-bottons-wrapper">
              <button className="pop-up-button" onClick={this.hidePopup}>
                <Translator string="chooseLanguage" />
              </button>
            </div>
            {/* end of pop-up buttons */}

            {/* end of pop-up body wrapper  */}
          </PopUp>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /*  Change the Layout style of the Simpliadmin root */
    isLayoutClassChanged: state.saClassToggler.isChanged,
    /*  get the paretnIndex when creating new element */
    showLangChoice: state.ssheader.showLangChoice,

    activeTreeNode: state.saCatsReducer.activeTreeNode,
    /* whether to show the options popup or not */
    showOptions: state.saCatsReducer.showOptions,

    /* when user clicks on delete button */
    showDeletionMessage: state.saCatsReducer.showDeletionMessage,

    /* use this in addItem method to get the new index of the new created item */
    tree: state.saCatsReducer.tree,

    /* get deletion message based on language */
    language: state.lang.lang,

    /* if somthing wrong happend when adding/renaming/deleteing  an item from the tree */
    showMessage: state.messages.showMessage,
    messageTitle: state.messages.title,
    messageText: state.messages.text,

    /* add new form popup */
    showAddFormPopup: state.saForms.showAddPopup,

    /* delete form message popup */
    showFormDeletionMessage: state.saForms.showFormDeletionMessage,
    /* current active form */
    activeForm: state.saForms.activeForm,

    /* when user sends request show then a message while the response is ready */
    showProcessing: state.saCatsReducer.showProcessing,

    /* when adding new form decide whether it's form or sub-form */
    activeFormsListTag: state.activeItems.activeFormsListTag,
    isDuplicateFormButtonClicked:
      state.activeItems.isDuplicateFormButtonClicked,
    showFormNamelessError: state.messages.showFormNamelessError,

    formDeletionMessageKey: state.saCatsReducer.formDeletionMessageKey,
    activeStaticPage: state.activeItems.activeStaticPage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Simpliadmin);
