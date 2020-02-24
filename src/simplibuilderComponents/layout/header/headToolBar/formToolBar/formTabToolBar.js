import React, { Fragment, Component } from "react";
import icons from "../../../../../configs/icons";
import ContentHolder from "../contentHolder";
import FormTabButton from "./formTabButton";
import { Translator } from "../../../../../components/utils";

import { connect } from "react-redux";
import { updateData } from "../../../../../store/actions/rootActions";

import translator from "../../../../../funcs/translator";
import { request } from "../../../../../funcs/http";

/* set message data upon success or failure */
import messages from "../../../../../configs/messages";

/* tool bar for Element tab in the header */

class FormTabToolBar extends Component {
  state = { rangeValue: 50, active: "btn-Select" };

  /* change the range value */
  onRangeChange = e => this.setState({ rangeValue: e.target.value });

  handleFormNameChange = e => {
    const { selectedForm } = this.props;

    if (selectedForm) {
      const updatedSelectedForm = { ...selectedForm, title: e.target.value };
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "selectedForm",
        item: updatedSelectedForm
      });
    }
  };

  /* this method will trigger when clicking on select / edit buttons  */
  /* change active button */
  changeActive = (e, changeDraggableStatus) => {
    /* if user clicked on any button except the move button the deactivate workplace draggables */
    if (!changeDraggableStatus) {
      this.props.updateData("WORK_PLACE_DRAGGABLES_ACTIVITY", false);
      /* if user clicked in the move button then make workplace draggables active*/
    } else {
      this.props.updateData("WORK_PLACE_DRAGGABLES_ACTIVITY", true);
    }
    this.props.updateData("UPDATE_FORM_TOOL_BAR_ACTIVE", e.target.id);
  };

  /* this method will trigger when clicking on property buttons*/
  /* activate all clicked on buttons */
  handlePropertyClick = e => {
    const selected = this.props.selected;
    const index = selected.indexOf(e.target.id);
    if (index === -1) {
      /* if button is not selected then add it to the selected buttons */
      selected.push(e.target.id);
    } else {
      /* if button is already seleceted then remove it from selected items */
      selected.splice(index, 1);
    }
    this.props.updateData("UPDATE_SELECTED", selected);
    return index;
  };

  /* this method will send data to 2 reducers workplace reducer and formToolBarReducer */
  /* workplace is lestning to paegs in workplaceContainer.js */
  togglePages = (e, key) => {
    const { items } = this.props;
    this.props.updateData("PAGE", e.target.id); /* update pages */
    // console.log(key)
    // this.props.updateData("UPDATE_ACTIVE", key);
    const i = this.handlePropertyClick(
      e
    ); /* update formToolBar active buttons */

    /* if the button is not already clicked then show the side-bar buttons that relates to this button  */
    if (i === -1) {
      this.props.updateData("SIDEBAR_BLOCK", e.target.name);
      return;
    }
    /*
      if the button is already clicked then
      if mutilple buttons are clicked show the side-bar buttons that relates to the button after this one
      else don't show side-bar buttons
    */

    if (items && items.length >= 2) {
      let position;
      items.map((item, i) => {
        position = item.button.name === e.target.name ? i : position;
        return null;
      });

      /* if the removed item is the last one then set the item before it as the active one */
      /* else set the item after it as the active one */
      const item =
        position === items.length - 1
          ? items[items.length - 2]
          : items[position + 1];
      this.props.updateData("SIDEBAR_BUTTONS", item.button.name);
      this.props.updateData("SIDEBAR_BLOCK", item.button.name);
    } else {
      this.props.updateData("SIDEBAR_BUTTONS", "empty");
      this.props.updateData("SIDEBAR_BLOCK", "empty");
    }
  };

  handleOpenNewFormClick = () => {
    const { language } = this.props;
    const messageTitle = messages[language]["saveForm"]["title"];
    const messageText = messages[language]["saveForm"]["text"];
    this.props.updateData("SET_MESSAGE_DATA", {
      text: messageText,
      title: messageTitle
    });
    this.props.updateData("SHOW_ERROR", {
      key: "showFormSaveWarning",
      value: true
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isNewFormButtonClicked",
      item: true
    });
  };

  handleSaveClick = () => {
    const { selectedForm } = this.props;
    if (selectedForm && selectedForm.isNew) {
      this.props.updateData("SHOW_SELECT_FILE", true);
    }

    /*if user change the name of an existing form */
    if (
      !selectedForm.isNew &&
      selectedForm.title !== selectedForm.originalTitle
    ) {
      this.props.updateData("SHOW_RENAME_FORM_WARNING", true);
      return;
    }

    /* formSave will decide whethet to update form or create new one */
    if (!selectedForm.isNew) {
      this.saveForm();
    }
  };

  handleSaveAsClick = () => {
    const { selectedForm } = this.props;
    if (selectedForm) {
      this.props.updateData("SHOW_SELECT_FILE", true);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "selectedForm",
        item: { ...selectedForm, isNew: true }
      });
    }
  };

  /* open existing form */
  handleOpenFormClick = () => {
    const { language } = this.props;
    const messageTitle = messages[language]["saveForm"]["title"];
    const messageText = messages[language]["saveForm"]["text"];
    this.props.updateData("SET_OPEN_EXISTING_FORM", true);
    this.props.updateData("SET_MESSAGE_DATA", {
      text: messageText,
      title: messageTitle
    });
    this.props.updateData("SHOW_ERROR", {
      key: "showFormSaveWarning",
      value: true
    });
  };

  /* create new form */
  addNewForm = payload => {
    const {
      selectedForm,
      language,
      activeTreeNode,
      userOpensExistingForm,
      forms
    } = this.props;

    /* to which simpliadmin tag should be added */
    const key =
      activeTreeNode.slug === "root" ? "master" : `form_${activeTreeNode.id}`;

    request("forms/", payload)
      .then(resp => {
        const messageTitle = messages[language]["successSaved"]["title"];
        const messageText = messages[language]["successSaved"]["text"];
        const updatedSelectedForm = {
          ...selectedForm,
          isNew: false,
          originalTitle: selectedForm.title,
          id: resp.data.id,
          slug: resp.data.slug,
          category: { id: resp.data.category },
          default_lang: { id: resp.data.default_lang },
          is_empty: payload.is_empty,
          date: resp.data.date
        };

        /* sho success message */
        this.props.updateData("SET_MESSAGE_DATA", {
          title: messageTitle,
          text: messageText,
          showMessage: true
        });

        this.props.updateData("SET_ACTIVE_ITEM", {
          key: "selectedForm",
          item: updatedSelectedForm
        });

        /* if user clikced on open button in simpliBuilder */
        /* after saving data show him select form screen */
        if (userOpensExistingForm) {
          this.props.updateData("SHOW_SELECT_SCREEN", true);
          this.props.updateData("SET_OPEN_EXISTING_FORM", false);
        }
        /*empty newWords (words needs to be saved)*/
        this.props.updateData("RESET_NEW_WORDS");
        /* whether to add this new form to simplisend */
        if (forms[key] && !payload.is_empty) {
          this.props.updateData("ADD_FORM", {
            key,
            form: {
              ...updatedSelectedForm,
              category: { id: resp.data.category },
              default_lang: { id: resp.data.default_lang },
              type: payload.type,
              isCreated: true,
              is_empty: payload.is_empty
            }
          });
        }
      })
      .catch(e => {
        const key =
          e.message === "Request failed with status code 400"
            ? "formDuplicateTitle"
            : "error";
        const messageTitle = messages[language][key]["title"];
        const messageText = messages[language][key]["text"];
        this.props.updateData("SET_MESSAGE_DATA", {
          title: messageTitle,
          text: messageText,
          showMessage: true
        });
      });
    return;
  };

  /* update an existing form */
  updateForm = payload => {
    const {
      selectedForm,
      language,
      userOpensExistingForm,
      formDetails,
      langsTable
    } = this.props;

    /* if user opend an old form */
    request(`forms/${selectedForm.slug}/`, payload, "put")
      .then(resp => {
        const messageTitle = messages[language]["successSaved"]["title"];
        const messageText = messages[language]["successSaved"]["text"];
        this.props.updateData("SET_MESSAGE_DATA", {
          title: messageTitle,
          text: messageText,
          showMessage: true
        });
        /*empty newWords (words needs to be saved)*/
        this.props.updateData("RESET_NEW_WORDS");

        /* empty form words in simpliadmin to get all new words */
        this.props.updateData("SET_LANG_WORDS", {
          key: selectedForm.id,
          words: null
        });

        /* if form was empty and user opened it and added data to it*/

        if (!payload.is_empty && selectedForm.is_empty) {
          const k =
            selectedForm.category.id === 1 ? "all" : selectedForm.category.id;
          this.props.updateData("SET_FORMS", { key: "all", forms: null });
          this.props.updateData("SET_FORMS", { key: k, forms: null });
        }

        /* add new changes to form */
        if (formDetails[selectedForm.id]) {
          this.props.updateData("SET_FORM_DETAILS", {
            key: selectedForm.id,
            details: null,
            type: "details"
          });
        }

        if (langsTable[selectedForm.id]) {
          this.props.updateData("SET_LANG_WORDS", {
            key: selectedForm.id,
            words: null
          });
        }

        /* after saving data show him select form screen */
        if (userOpensExistingForm) {
          this.props.updateData("SHOW_SELECT_SCREEN", true);
          this.props.updateData("SET_OPEN_EXISTING_FORM", false);
        }
      })
      .catch(e => {
        const key =
          e.message === "Request failed with status code 400"
            ? "formDuplicateTitle"
            : "error";
        const messageTitle = messages[language][key]["title"];
        const messageText = messages[language][key]["text"];
        this.props.updateData("SET_MESSAGE_DATA", {
          title: messageTitle,
          text: messageText,
          showMessage: true
        });
      });
  };

  // //get input ids for shortText
  // getShortTextInputId = data => {
  //   const ids = data.slice(1).map(item => {
  //     return { content: item.inputId, id: data[0]["id"] };
  //   });
  //   return ids;
  // };

  // //get input ids for dropList
  // getDropdownInputId = data => {
  //   const ids = data.slice(1).map(item => {
  //     return { content: item.inputId, id: data[0]["elementId"] };
  //   });
  //   return ids;
  // };

  // //get input id for  radioChoice, checkbox
  // getRadioCheckInputId = data => {
  //   return [{ content: data[0]["inputId"], id: data[0]["id"] }];
  // };

  // // get input ids for upload file
  // getFileInputId = data => {
  //   return [{ content: data["inputId"], id: data["elementId"] }];
  // };

  // // get all input ids to save them in inputIds tabel
  // getInputId = data => {
  //   const { droppables, activeDetails } = this.props;

  //   const ids = [];
  //   const MAP_TYPE_TO_METHOD = {
  //     shortText: this.getShortTextInputId,
  //     dropList: this.getDropdownInputId,

  //     radioChoice: this.getRadioCheckInputId,
  //     checkBox: this.getRadioCheckInputId,
  //     uploadFile: this.getFileInputId
  //   };

  //   Object.keys(droppables).map(k => {
  //     if (k !== "formWorkplaceElements" && droppables[k].length > 0) {
  //       const item = droppables[k][0];
  //       const action = MAP_TYPE_TO_METHOD[item.type];

  //       action && ids.push(...action(activeDetails[item.id]));
  //     }
  //     return null
  //   });
  //   console.log(ids);
  //   return ids;
  // };

  /* warpas whole savef form login (create or update) */
  saveForm = () => {
    const {
      selectedForm,
      droppables,
      activeTreeNode,
      activeDetails,
      activeFormsListTag,
      newWords
    } = this.props;

    /* if user opend new form */
    const key = `${selectedForm.title}_${selectedForm.default_lang.label}`;
    let words;
    //const ids = this.getInputId();

    if (
      selectedForm.isNew ||
      selectedForm.originalTitle !== selectedForm.title
    ) {
      // form name should be translatable
      words = {
        ...newWords,
        [key]: {
          translation_id: null,
          content: selectedForm.title,
          language: selectedForm.default_lang.id
        }
      };
    } else {
      words = { ...newWords };
    }

    //&& activeTreeNode
    if (selectedForm) {
      const texts = Object.keys(words).map(key => words[key]);
      console.log(texts);
      const category = selectedForm.isNew
        ? activeTreeNode.id
        : selectedForm.category.id;

      const payload = {
        ...selectedForm,
        default_lang: selectedForm.default_lang.id,
        category: category,
        // inputIds: ids,
        type: selectedForm.isNew
          ? activeTreeNode.slug === "root"
            ? "form"
            : activeFormsListTag
          : selectedForm.type,
        data: JSON.stringify({
          elements: droppables,
          details: activeDetails
        }),
        texts,
        is_empty:
          droppables &&
          activeDetails &&
          Object.keys(droppables).length > 0 &&
          Object.keys(activeDetails).length
            ? false
            : true
      };

      /* if user creating new form */
      if (selectedForm.isNew) {
        this.addNewForm(payload);
        return;
      }
      this.updateForm(payload);
      this.props.updateData("REMOVE_FORM_TEMP_DATA", selectedForm.id);
    }
  };

  render = () => {
    return (
      <Fragment>
        <ContentHolder id="new_open_save_group">
          <FormTabButton
            id="btn-New"
            cls="symbol-btn"
            symbol={icons.new}
            action={this.handleOpenNewFormClick}
          />
          <FormTabButton
            id="btn-Open"
            cls="symbol-btn"
            symbol={icons.open}
            action={this.handleOpenFormClick}
          />
          <FormTabButton
            id="btn-Save"
            cls="symbol-btn"
            symbol={icons.save}
            action={this.handleSaveClick}
          />
          <FormTabButton
            id="btn-Save_as"
            cls="symbol-btn"
            symbol={icons.saveAs}
            action={this.handleSaveAsClick}
          />
          <span id="btn-NewText" className="tool_group_title">
            <Translator string="new" />
          </span>
        </ContentHolder>
        <ContentHolder
          id="undo_redo_group"
          title={<Translator string="history" />}
        >
          <FormTabButton
            id="btn-Undo"
            cls="symbol-btn"
            symbol={icons.undo}
            action={() => console.log("sdfsdf")}
          />
          <FormTabButton
            id="btn-Redo"
            cls="symbol-btn"
            symbol={icons.redo}
            action={() => console.log("sdfsdf")}
          />
          <span id="btn-RedoText" className="tool_group_title">
            <Translator string="redo" />
          </span>
          <span id="btn-UndoText" className="tool_group_title">
            <Translator string="undo" />
          </span>
        </ContentHolder>
        <ContentHolder
          id="select_edit_group"
          title={<Translator string="select_edit" />}
        >
          <FormTabButton
            type="activeButton"
            id="btn-Select"
            cls="symbol-btn-Borderd"
            symbol={icons.select}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Move"
            cls="symbol-btn-Borderd"
            symbol={icons.move}
            action={(e, changeDraggableStatus) => this.changeActive(e, true)}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Divide"
            cls="symbol-btn-Borderd"
            symbol={icons.property}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-SaveElement"
            cls="symbol-btn-Borderd"
            symbol={icons.save}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Duplicate"
            cls="symbol-btn-Borderd"
            symbol={icons.duplicate}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Delete"
            cls="symbol-btn-Borderd"
            symbol={icons.delete}
            action={this.changeActive}
          />
        </ContentHolder>
        <ContentHolder
          id="properties_group"
          title={<Translator string="features" />}
        >
          <FormTabButton
            id="buttonHide"
            cls="symbol-btn-Borderd"
            symbol={icons.hide}
            action={this.handlePropertyClick}
          />
          <FormTabButton
            id="btn-ReadOnly"
            cls="symbol-btn-Borderd"
            symbol={icons.readOnly}
            action={this.handlePropertyClick}
          />
          <FormTabButton
            id="btn-Title"
            cls="symbol-btn-Borderd"
            symbol={icons.title}
            action={this.handlePropertyClick}
          />
          <FormTabButton
            id="btn-Requierd"
            cls="symbol-btn-Borderd"
            symbol={icons.requierd}
            action={this.handlePropertyClick}
          />
          <FormTabButton
            id="btn-Unprintable"
            cls="symbol-btn-Borderd"
            symbol={icons.unprintable}
            action={this.handlePropertyClick}
          />
          <FormTabButton
            id="btn-Clone"
            cls="symbol-btn-Borderd"
            symbol={icons.clone}
            action={this.handlePropertyClick}
          />
        </ContentHolder>
        <ContentHolder
          id="form_name_group"
          title={<Translator string="formName" />}
        >
          <input
            id="nameInput"
            placeholder={translator("formNameHolder", this.props.titles)}
            value={this.props.selectedForm ? this.props.selectedForm.title : ""}
            onChange={this.handleFormNameChange}
          />
        </ContentHolder>
        <ContentHolder
          id="element_builder_group"
          title={<Translator string="elementBuilder" />}
        >
          <FormTabButton
            id="btn-Form_Nav"
            cls="symbol-btn_2"
            symbol={icons.formNav}
            action={e => this.togglePages(e, "btn-B_TagForm")}
            name="form"
          />
          <FormTabButton
            id="btn-Paper_Nav"
            cls="symbol-btn_2"
            symbol={icons.paperNav}
            action={e => this.togglePages(e, "btn-B_TagPaper")}
            name="paper"
          />
          <FormTabButton
            id="btn-PopUp_Nav"
            cls="symbol-btn_2"
            symbol={icons.popupNav}
            action={e => this.togglePages(e, "btn-B_TagFilter")}
            name="pop-up"
          />
          <FormTabButton
            id="btn-Filter_Nav"
            cls="symbol-btn_2"
            symbol={icons.filterNav}
            action={e => this.togglePages(e, "btn-B_TagPop-up")}
            name="filter"
          />
          <span id="btn-Form_Nav_Text" className="tool_group_title">
            <Translator string="form" />
          </span>
          <span id="btn-Paper_Nav_Text" className="tool_group_title">
            <Translator string="paper" />
          </span>
          <span id="btn-PopUp_Nav_Text" className="tool_group_title">
            <Translator string="pop-up" />
          </span>
          <span id="btn-Filter_Nav_Text" className="tool_group_title">
            <Translator string="filter" />
          </span>
        </ContentHolder>
        <ContentHolder
          id="preview_group"
          title={<Translator string="preview" />}
        >
          <button id="btn-Form_Preview" className="btn-Preview">
            <Translator string="form" />
          </button>
          <button id="btn-Print_Preview" className="btn-Preview">
            <Translator string="paper" />
          </button>
          <div>
            <span id="desktopIcon" className="icon_1">
              {icons.desktop}
            </span>
            <span id="mobileIcon" className="icon_1">
              {icons.mobile}
            </span>
          </div>
          <div id="sliderTrack" />
          <input
            type="range"
            min="1"
            max="100"
            id="slider"
            value={this.state.rangeValue}
            onChange={this.onRangeChange}
          />
        </ContentHolder>
      </Fragment>
    );
  };
}

const mapStoreToProps = state => {
  return {
    /*
      when adding new page to workplace i need current existing pages
      workplaceContainer is lestning to this variable
    */
    items: state.workplace.items,

    /* which header buttons is selected now*/
    selected: state.formToolBar.selected,

    /* i need this to user the translator function in placeholder */
    titles: state.lang.titles,

    /*data to be saved to form */
    droppables: state.droppables.droppables,

    /* set message title and message text based on language*/
    language: state.lang.lang,

    /* which tree item is active now */
    activeTreeNode: state.saCatsReducer.activeTreeNode,

    /* details for current opened form in form builder */
    activeDetails: state.formDetails.activeDetails,

    /* current form in form builder */
    selectedForm: state.activeItems.selectedForm,
    /* when saving new form decide whether it's type is form or sub-form*/
    activeFormsListTag: state.activeItems.activeFormsListTag,

    /* when user clicks on open form in simpli builder*/
    userOpensExistingForm: state.starter.userOpensExistingForm,
    forms: state.saForms.forms,
    newWords: state.translation.newWords,
    formDetails: state.formDetails.details,

    langsTable: state.translation.langsTable
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* dispatch new pages to workplace reducer */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(FormTabToolBar);
