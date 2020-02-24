import React, { Component } from "react";
import {
  StarterScreen,
  SelectForm,
  SelectFile,
  SelectLanguage
} from "./starter";
import { updateData } from "../../store/actions/rootActions";
import { connect } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import SideBar from "./sidebar/sidebar";
import ToolBar from "./header/toolbar";
import { WorkPlaceContainer } from "../workplace";
import { ElementsTree, PopUp, Translator } from "../../components/utils";
import { request } from "../../funcs/http";
/* set message data upon success or failure */
import messages from "../../configs/messages";
import generateRandromString from "../../funcs/generateRandromString";

/* wraps start screen and everything between header and footer */
class BodyWrapper extends Component {
  componentDidMount = () => {
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormDetails",
      item: null
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderActive",
      item: false
    });
  };

  /* when draggin elements from side bar to work place */
  handleElementMoveAcrossColumns = (source, destination) => {
    /* add elements to droppable if it does not need a popup */
    const popUpElements = [
      "shortText",
      "dropList",
      "radioChoice",
      "checkBox",
      "image",
      "uploadFile",
      "grid",
      "uploadSvg",
      "block",
      "textBlock"
    ];

    let sourceColumn;

    if (
      this.props.currentActivePage === "formContainer" ||
      source.droppableId === "paper"
    ) {
      sourceColumn = this.props.sideBarAllButtons[this.props.sideBarTitle][
        this.props.sideBarBlock
      ];
    } else {
      if (!this.props.isRightDroppableActive) {
        sourceColumn = this.props.sideBarAllButtons[this.props.sideBarTitle][
          this.props.sideBarBlock
        ];
      } else {
        sourceColumn = this.props.droppables[source.droppableId];
      }
    }

    // const sourceColumn = this.props.sideBarAllButtons[this.props.sideBarTitle][
    //   this.props.sideBarBlock
    // ];
    const destinationColumn = this.props.droppables[destination.droppableId];
    const newElementId = generateRandromString();
    let element = sourceColumn[source.index];

    /* set id for each new dropped element */
    element = { ...element, id: element.type + newElementId };
    const newButton = { ...element, value: element.title };
    sourceColumn.splice(source.index, 1, newButton);
    destinationColumn.splice(destination.index, 0, element);

    if (
      this.props.currentActivePage === "paperContainer" &&
      source.droppableId === "formWorkplaceElements"
    ) {
      this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
        droppableId: destination.droppableId,
        column: destinationColumn,
        id: "block" + newElementId,
        type: "block"
      });
      this.props.updateData(`show_block`.toUpperCase(), true);
      return;
    }
    // console.log();
    /* which popup currently is active */
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      droppableId: destination.droppableId,
      column: destinationColumn,
      id: element.type + newElementId,
      type: element.type
    });

    /* show corresponding pop up (if any)*/
    this.props.updateData(`show_${element.type}`.toUpperCase(), true);

    if (popUpElements.indexOf(element.type) === -1) {
      /* initiat new form details */
      this.props.updateData("SET_FORM_DETAILS", {
        key: element.id,
        details: [element],
        type: "activeDetails"
      });

      /*
        add this new element (short text,textblock,....)
        to corresponding droppable (heading ,askAnswer , .....)
      */
      this.props.updateData("ADD_ELEMENT_TO_DROPPABLE", {
        key: destination.droppableId,
        column: destinationColumn
      });
    }
  };

  /* when dragging elements across the same workplace container */
  handleElementMoveAtTheSameColumn = (source, destination) => {
    let arr;
    const { droppables } = this.props;
    const array = droppables[source.droppableId];
    const result = [...array];
    result.splice(source.index, 1);
    const element = array[source.index];

    arr = [
      ...result.slice(0, destination.index),
      element,
      ...result.slice(destination.index)
    ];

    this.props.updateData("ADD_ELEMENT_TO_DROPPABLE", {
      key: source.droppableId,
      column: arr
    });
  };

  /* when dragging elements between 2 different workplace containers */
  handleElementMoveAcrossWokplaceContainers = (source, destination) => {
    const { droppables } = this.props;
    const sourceColumn = droppables[source.droppableId];
    const destinationColumn = droppables[destination.droppableId];
    const element = sourceColumn[source.index];
    sourceColumn.splice(source.index, 1);
    destinationColumn.splice(destination.index, 0, element);
    const newData = {
      sourceKey: source.droppableId,
      destinationKey: destination.droppableId,
      sourceColumn,
      destinationColumn
    };
    this.props.updateData("MOVE_ELEMENT_ACROSS_WORKPLACE_CONTAINERS", newData);
  };

  /* when user drop the element */
  handleDragEnd = result => {
    const sideBarDroppables = [
      "form",
      "paper",
      "pop-up",
      "filter",
      "formWorkplaceElements",
      "rightDroppable"
    ];
    const { source, destination } = result;

    /* if the user dropped the element in a none droppabpe place */
    if (!destination) {
      return;
    }

    if (destination.droppableId !== source.droppableId) {
      // if user drags element that represent a container to a container
      if (
        source.droppableId === "paperWorkplaceElements" &&
        destination.droppableId.startsWith("block")
      ) {
        return;
      }

      if (sideBarDroppables.indexOf(source.droppableId) !== -1) {
        /* dragging element from side-bar to workeplace  */
        this.handleElementMoveAcrossColumns(source, destination);
        return;
      }

      /* dragging element across 2 different workplace containers */
      this.handleElementMoveAcrossWokplaceContainers(source, destination);
      return;
    }

    /* dragging element across the same workplace container */
    this.handleElementMoveAtTheSameColumn(source, destination);
  };

  /* when user clicks  the open button */
  handleOpen = () => {
    this.props.updateData("SHOW_SELECT_SCREEN", true);
  };

  /* when user clicks the new button */
  handleNew = () => {
    const { currentActivePage } = this.props;
    this.setState({ showStarterScreen: false });
    this.props.updateData("SHOW_BUTTONS", true);
    this.props.updateData("TOGGLE_STARTER_SCREEN", false);
    /* what side bar buttons should appear */
    this.props.updateData("SIDEBAR_BLOCK", "form");

    /* active buttons in toolbar*/
    this.props.updateData("UPDATE_SELECTED", ["btn-Form_Nav"]);

    /* change dropdown menu */
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderActive",
      item: true
    });

    this.props.updateData("SET_DROPABLES", {});

    !currentActivePage &&
      this.props.updateData(
        "PAGE",
        "btn-Form_Nav"
      ); /* display workplace page */
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "selectedForm",
      item: {
        title: "",
        category: null,
        img: null,
        data: {},
        is_private: false,
        isNew: true,
        originalTitle: "",
        default_lang: null
      }
    });

    this.props.updateData("SHOW_SELECTE_LANG", true);
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

        /* show success message */
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
        if (forms[key]) {
          const key =
            activeTreeNode.slug === "root"
              ? "master"
              : `form_${activeTreeNode.id}`;
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
        /*empty newWords (words need to be saved)*/
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

        /* if user clikced on open button in simpliBuilder */
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
  //   const { droppables, formDetails, activeDetails } = this.props;

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
  //   });

  //   return ids;
  // };

  /* warpas whole save form login (create or update) */
  saveForm = () => {
    const {
      selectedForm,
      droppables,
      activeTreeNode,
      activeDetails,
      activeFormsListTag,
      newWords
    } = this.props;
    // form name should be translatable
    const key = `${selectedForm.title}_${selectedForm.default_lang.label}`;
    let words;
    //const ids = this.getInputId();
    //console.log(ids);

    /* if user opend new form */
    if (selectedForm && activeTreeNode) {
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

      const texts = Object.keys(words).map(key => words[key]);
      console.log(words);
      console.log(texts);
      const category = selectedForm.isNew
        ? activeTreeNode.id
        : selectedForm.category.id;
      const payload = {
        ...selectedForm,
        default_lang: selectedForm.default_lang.id,
        category: category,
        //inputIds: ids,
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

  changeFormTitle = e => {
    const { selectedForm } = this.props;
    const updatedSelectedForm = { ...selectedForm, title: e.target.value };
    this.props.updateData("SET_SELECTED_FORM", updatedSelectedForm);
  };

  /* select tree item in which user wants to save the form */
  selectFile = () => {
    const { activeTreeNode, selectedForm, isSaveAsClicked } = this.props;

    if (!selectedForm.title) {
      this.props.updateData("SHOW_ERROR", {
        key: "showFormNamelessError",
        value: true
      });
      return;
    }

    if (activeTreeNode) {
      isSaveAsClicked &&
        this.props.updateData("SET_ACTIVE_ITEM", {
          key: "selectedForm",
          item: { ...selectedForm, isNew: true }
        });

      this.props.updateData("SHOW_SELECT_FILE", false);
      this.props.updateData("SHOW_ERROR", {
        key: "showFormNamelessError",
        value: false
      });
      this.saveForm();
    }
  };

  /* when user confirms he wants to open new form */
  openNewForm = () => {
    const { selectedForm, currentActivePage } = this.props;
    if (selectedForm) {
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "selectedForm",
        item: {
          title: "",
          category: null,
          img: null,
          data: {},
          is_private: false,
          isNew: true /* saveForm method will decide wether to save new form or update existing one based on this */,
          /*
            if user change the name of an existing form show him a message whether he wants to save it to new form
            or just change current form title
          */
          originalTitle: ""
        }
      });

      /* set acttive workplace page if it is null or if it does not equal formContainer*/
      if (
        !currentActivePage ||
        (currentActivePage && currentActivePage !== "formContainer")
      ) {
        this.props.updateData("RESET_PAGES");
      }
      /* set sidebar buttons */
      this.props.updateData("SIDEBAR_BLOCK", "form");
      /*set title for side bar */
      this.props.updateData("SIDEBAR_TITLE", "container");

      /* set header active button */
      this.props.updateData("UPDATE_SELECTED", ["btn-Form_Nav"]);
      /* empty all elements */
      this.props.updateData("SET_DROPABLES", {});
      /* show languages dropdown to choose from */
      this.props.updateData("SHOW_SELECTE_LANG", true);

      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "isNewFormButtonClicked",
        item: false
      });
    }
  };

  /* hide the tree when user clicks on cancel button */
  hideSelectFile = () => {
    const { selectedForm } = this.props;
    this.props.updateData("SET_ACTIVE_TREE_NODE", null);
    this.props.updateData("SHOW_SELECT_FILE", false);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSaveAsClicked",
      item: false
    });
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: false
    });

    selectedForm.id &&
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "selectedForm",
        item: { ...selectedForm, isNew: false }
      });
  };

  SaveAs = () => {
    const { selectedForm } = this.props;
    if (selectedForm && selectedForm.title) {
      this.props.updateData("SHOW_SAVE_AS_NAME_INPUT", false);
      this.props.updateData("SHOW_SELECT_FILE", true);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "selectedForm",
        item: { ...selectedForm, isNew: true }
      });
    }
  };

  /* when user clicks on discard chages button when a message appears */
  discardChanges = () => {
    const {
      isSimpliBuilderActive,
      isSimpliBuilderNavButtonClicked,
      userOpensExistingForm,
      activeNavLink
    } = this.props;

    if (
      (!isSimpliBuilderActive && !isSimpliBuilderNavButtonClicked) ||
      (isSimpliBuilderActive && !isSimpliBuilderNavButtonClicked)
    ) {
      this.props.updateData("SHOW_ERROR", {
        key: "showFormSaveWarning",
        value: false
      });
      if (userOpensExistingForm) {
        this.props.updateData("SHOW_SELECT_SCREEN", true);
        this.props.updateData("SET_OPEN_EXISTING_FORM", false);
      } else {
        this.openNewForm();
      }
      return;
    }

    if (isSimpliBuilderActive && !isSimpliBuilderNavButtonClicked) {
    }
    activeNavLink && this.props.history.push(activeNavLink);
    this.props.activeNavLink &&
      this.props.updateData("UPDATE_FORM_TOOL_BAR_ACTIVE", "btn-Select");
    this.props.updateData("SHOW_ERROR", {
      key: "showFormSaveWarning",
      value: false
    });
  };

  render = () => {
    const {
      showSelectFile,
      selectedForm,
      language,
      showRenameFormWarning,
      showMessage,
      messageText,
      messageTitle,
      showFormSaveWarning,
      isNewFormButtonClicked,
      currentActivePage
    } = this.props;

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <div id="bodyContainer">
          {/* tool bar */}
          <ToolBar />

          {/* workplace */}

          <div id="workPlace">
            <div id="wPtagGroup">
              <WorkPlaceContainer />
            </div>
          </div>

          {/* left side bar */}
          <div id="left" className="sb_sideBarContainer">
            <SideBar />
          </div>

          {/*right side bar      */}
          <div id="right" className="sb_sideBarContainer">
            <ElementsTree
              droppableName={"formWorkplaceElements"}
              disabled={currentActivePage !== "formContainer"}
            />
          </div>
        </div>
        {this.props.showStarterScreen && (
          <StarterScreen
            handleOpen={this.handleOpen}
            handleNew={this.handleNew}
          />
        )}

        <SelectForm />

        <div className="sb-main-popup-wrapper">
          <PopUp show={showSelectFile}>
            <div className="popup-header">
              <Translator string="selectFormHeading" />
            </div>

            <SelectFile />

            <div className="pop-up-bottons-wrapper">
              <button className="pop-up-button" onClick={this.selectFile}>
                <Translator string="select" />
              </button>
              <button className="pop-up-button" onClick={this.hideSelectFile}>
                <Translator string="cancel" />
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sb-main-popup-wrapper">
          <PopUp show={showRenameFormWarning}>
            <div className="popup-header">
              {messages[language]["changeFormName"]["title"]}
            </div>
            <div className="popup-body">
              <div className="massage">
                {messages[language]["changeFormName"]["text"]}
              </div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SHOW_RENAME_FORM_WARNING", false);
                  this.saveForm();
                }}
              >
                <Translator string="rename" />
              </button>
              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SET_ACTIVE_ITEM", {
                    key: "selectedForm",
                    item: { ...selectedForm, isNew: true }
                  });
                  this.props.updateData("SHOW_RENAME_FORM_WARNING", false);
                  this.props.updateData("SHOW_SELECT_FILE", true);
                }}
              >
                <Translator string="newSave" />
              </button>
              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SHOW_RENAME_FORM_WARNING", false);
                }}
              >
                <Translator string="cancel" />
              </button>
            </div>
          </PopUp>
        </div>

        <SelectLanguage />

        <div className="sb-main-popup-wrapper">
          <PopUp show={showMessage}>
            <div className="popup-header">{messageTitle}</div>
            <div className="popup-body">
              <div className="massage">{messageText}</div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SET_MESSAGE_DATA", {
                    title: "",
                    text: "",
                    showMessage: false
                  });

                  this.props.isSimpliBuilderNavButtonClicked &&
                    this.props.history.push(this.props.activeNavLink);
                  isNewFormButtonClicked && this.openNewForm();

                  this.props.activeNavLink &&
                    this.props.updateData(
                      "UPDATE_FORM_TOOL_BAR_ACTIVE",
                      "btn-Select"
                    );
                }}
              >
                <Translator string="ok" />
              </button>
            </div>
          </PopUp>
        </div>

        <div className="sb-main-popup-wrapper">
          <PopUp show={showFormSaveWarning}>
            <div className="popup-header">{messageTitle}</div>
            <div className="popup-body">
              <div className="massage">{messageText}</div>
            </div>
            <div className="pop-up-bottons-wrapper">
              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SHOW_ERROR", {
                    key: "showFormSaveWarning",
                    value: false
                  });
                  if (selectedForm.isNew) {
                    this.props.updateData("SHOW_SELECT_FILE", true);
                  } else {
                    this.saveForm();
                  }
                }}
              >
                <Translator string="save" />
              </button>

              <button className="pop-up-button" onClick={this.discardChanges}>
                <Translator string="discardChanges" />
              </button>

              <button
                className="pop-up-button"
                onClick={() => {
                  this.props.updateData("SHOW_ERROR", {
                    key: "showFormSaveWarning",
                    value: false
                  });
                  this.props.updateData("SET_OPEN_EXISTING_FORM", false);
                  this.props.updateData("SET_ACTIVE_ITEM", {
                    key: "activeNavLink",
                    item: null
                  });
                  this.props.updateData("SET_ACTIVE_ITEM", {
                    key: "isSimpliBuilderNavButtonClicked",
                    item: false
                  });
                  this.props.updateData("SET_ACTIVE_ITEM", {
                    key: "isNewFormButtonClicked",
                    item: false
                  });
                }}
              >
                <Translator string="cancel" />
              </button>
            </div>
          </PopUp>
        </div>
      </DragDropContext>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* move elements from one column to another */
    droppables: state.droppables.droppables,

    isRightDroppableActive: state.droppables.isRightDroppableActive,

    /*title of left side bar */
    sideBarTitle: state.sideBar.title,

    /* which buttons to show in left side bar */
    sideBarBlock: state.sideBar.block,
    sideBarAllButtons: state.sideBar.buttons,

    /* ask user wether he wants to work on existing form or create new one */
    showStarterScreen: state.starter.show,

    /* when saving form show all tree item to select the one in which u want to save the form */
    showSelectFile: state.starter.showSelectFile,

    /* when saving forms get the file in which u want to save form in */
    activeTreeNode: state.saCatsReducer.activeTreeNode,
    /* when getting message data */
    language: state.lang.lang,

    /*
      if user opened an existing form and changed it's name then ask him whether he wants to only rename the form
      or save the content to a new form
    */
    showRenameFormWarning: state.starter.showRenameFormWarning,

    activeDetails: state.formDetails.activeDetails,

    showMessage: state.messages.showMessage,
    messageTitle: state.messages.title,
    messageText: state.messages.text,

    /* message whether user wants to save changes or not */
    showFormSaveWarning: state.messages.showFormSaveWarning,

    /* current opened form in formBuilder */
    selectedForm: state.activeItems.selectedForm,

    /* when saving new form decide whether it's type is form or sub-form*/
    activeFormsListTag: state.activeItems.activeFormsListTag,
    /* when user clicks on open form in simpli builder*/
    userOpensExistingForm: state.starter.userOpensExistingForm,
    forms: state.saForms.forms,
    currentActivePage: state.workplace.currentActivePage,
    newWords: state.translation.newWords,

    /* whether simpli builder is active or not */
    isSimpliBuilderActive: state.activeItems.isSimpliBuilderActive,

    /* when user clicks on a link in dropdown menu in simpli builder */
    /* i need this variable so i can change the default behavior of some methods such as (discard changes and save)*/
    isSimpliBuilderNavButtonClicked:
      state.activeItems.isSimpliBuilderNavButtonClicked,
    activeNavLink: state.activeItems.activeNavLink,

    formDetails: state.formDetails.details,

    langsTable: state.translation.langsTable,

    isNewFormButtonClicked: state.activeItems.isNewFormButtonClicked
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* display header buttons after the starter screen disappear */
    /* update droppables after moving element betweeen columns */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BodyWrapper);
