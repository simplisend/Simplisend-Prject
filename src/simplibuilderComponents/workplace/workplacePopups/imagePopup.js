import React, { Component } from "react";
import { connect } from "react-redux";
import titles from "../../../configs/title";
import translator from "../../../funcs/translator";
import {
  Translator,
  PopUp,
  ClickOutsideOptionsList
} from "../../../components/utils";
import { updateData } from "../../../store/actions/rootActions";
import { request, getRequest } from "../../../funcs/http";
import generateRandomString from "../../../funcs/generateRandromString";

class ImagePopup extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    const { activeElement, images } = this.props;
    if (
      activeElement &&
      !images[activeElement.id] &&
      activeElement.type === "image"
    ) {
      this.props.updateData("SET_IMAGE", activeElement.id);
      return;
    }
  };

  // when user selects an option from auto complete options
  handleAutoCompleteOptionClick = (item, key) => {
    const { images, activeElement } = this.props;

    const updatedImage = {
      ...images[activeElement.id],
      [key]: item.content
    };
    this.props.updateData("SET_IMAGE", {
      key: activeElement.id,
      image: updatedImage
    });
    this.closeAutoCompleteOptions();
  };

  /* get all matching data when user is filling question input */
  getWords = (value, key) => {
    const { selectedForm, activeElement } = this.props;
    const formLanguage = selectedForm.default_lang.id;

    getRequest(
      `text/form_text_contains?lang=${formLanguage}&text=${value}`
    ).then(resp => {
      this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", resp.data);
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeAutoCompleteItem",
        item: { id: `${activeElement.id}_image_${key}` }
      });
    });
  };

  submit = () => {
    const { activeElement, images,newWords,selectedForm } = this.props;
    const isValid = this.validate();
    
    if (isValid) {
      this.props.updateData("SET_FORM_DETAILS", {
        key: activeElement.id,
        details: images[activeElement.id],
        type: "activeDetails"
      });
      this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
      this.props.updateData("SHOW_IMAGE", false); 
      
      const words = { ...newWords, [`${activeElement.id}_image_disc`] :{
        content : images[activeElement.id]['description'] , 
        translation_id : null , 
        language: selectedForm.default_lang.id
      },[`${activeElement.id}_image_tag`] : {
        content : images[activeElement.id]['tag'] , 
        translation_id : null , 
        language: selectedForm.default_lang.id
      }};
     
      
      this.props.updateData("ADD_NEW_WORD", {
        key: activeElement.id,
        words
      });

      if (images[activeElement.id]["isNew"]) {
        const payload = {
          image: images[activeElement.id]["file"],
          id: images[activeElement.id]["id"],
          title: images[activeElement.id]["imgTitle"],
          user_width: images[activeElement.id]["user_width"],
          user_height: images[activeElement.id]["user_height"],
          width: images[activeElement.id]["file"].width,
          height: images[activeElement.id]["file"].height,
          hasTag: images[activeElement.id]["hasTag"],
          tag: images[activeElement.id]["tag"],
          isNew: images[activeElement.id]["isNew"],
          description: images[activeElement.id]["description"]
        };

        request("form-image/", payload).then(resp => {
          this.props.updateData("SET_FORM_DETAILS", {
            key: activeElement.id,
            details: {
              ...resp.data,
              url: `${resp.data.image}`,
              img: images[activeElement.id]["img"],
              hasTag: images[activeElement.id]["hasTag"],
              tag: images[activeElement.id]["tag"],
              description: images[activeElement.id]["description"],
              imgTitle: images[activeElement.id]["imgTitle"],
              id: generateRandomString()
            },
            type: "activeDetails"
          });
        });
      }

      return;
    }
    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
  };

  cancel = () => {
    this.props.updateData("SHOW_IMAGE", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  validate = () => {
    const { images, activeElement } = this.props;
    const types = ["jpeg", "png", "jpg", "gif"];
    const ext = images[activeElement.id]["imgTitle"].split(".")[1];
    if (types.indexOf(ext) === -1) {
      return false;
    }
    if (
      !images[activeElement.id]["imgTitle"] &&
      images[activeElement.id]["isNew"]
    ) {
      return false;
    }
    if (
      !images[activeElement.id]["user_width"] ||
      !images[activeElement.id]["user_height"]
    ) {
      return false;
    }
    return true;
  };

  onChooseFile = e => {
    const { images, activeElement } = this.props;
    const reader = new FileReader();
    const blobUrl = URL.createObjectURL(e.target.files[0]);

    const title = e.target.value;
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const updatedImage = {
        ...images[activeElement.id],
        img: blobUrl,
        imgTitle: title,
        isNew: true,
        file: e.target.result
      };
      this.props.updateData("SET_IMAGE", {
        key: activeElement.id,
        image: updatedImage
      });
    };
  };

  handleChange = (e, key) => {
    const { images, activeElement } = this.props;
    const updatedImage = { ...images[activeElement.id], [key]: e.target.value };

    const search = ["tag", "description"];
    if (search.indexOf(key) !== -1 && e.target.value.length >= 3) {
      this.getWords(e.target.value, key);
    }
    this.props.updateData("SET_IMAGE", {
      key: activeElement.id,
      image: updatedImage
    });
  };

  toggleCheck = () => {
    const { activeElement, images } = this.props;
    const updatedImage = {
      ...images[activeElement.id],
      hasTag: !images[activeElement.id]["hasTag"]
    };
    this.props.updateData("SET_IMAGE", {
      key: activeElement.id,
      image: updatedImage
    });
  };

  /* close autoCompleteOptions (this will remove previous data) */
  closeAutoCompleteOptions = () => {
    this.props.updateData("SHOW_AUTO_COMPLETE_OPTIONS", false);
    this.props.updateData("SET_AUTO_COMPLETE_OPTIONS", null);
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "autoCompleteActiveItem",
      item: null
    });
  };

  render = () => {
    const {
      show,
      activeElement,
      showFormNamelessError,
      images,
      showAutoCompleteOptionsPopup,
      autoCompleteOptions,
      activeAutoCompleteItem
    } = this.props;

    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={show}>
          <div className="popup-header">
            <Translator string="image" />
          </div>

          <div className="popup-body">
            <h3>
              {" "}
              <Translator string="imagePopup" />{" "}
            </h3>
            <div className="content-wrapper">
              {showFormNamelessError && <p className="error">*</p>}
              <input
                type="file"
                onChange={this.onChooseFile}
                value={
                  // activeElement &&
                  // images[activeElement.id] ?
                  // images[activeElement.id]['imgTitle'] : ''
                  ""
                }
              />
            </div>

            <div className="img-popup-dimensions-container">
              {showFormNamelessError && <p className="error">*</p>}
              <span>
                Width
                <input
                  type="number"
                  value={
                    activeElement && images[activeElement.id]
                      ? images[activeElement.id]["user_width"]
                      : ""
                  }
                  onChange={e => this.handleChange(e, "user_width")}
                />
              </span>
              <span>
                {showFormNamelessError && <p className="error">*</p>}
                height
                <input
                  type="number"
                  value={
                    activeElement && images[activeElement.id]
                      ? images[activeElement.id]["user_height"]
                      : ""
                  }
                  onChange={e => this.handleChange(e, "user_height")}
                />
              </span>
            </div>

            <p>
              {" "}
              <Translator string="tag" />{" "}
            </p>
            <div>
              <input
                onChange={e => this.handleChange(e, "tag")}
                type="text"
                value={
                  activeElement && images && images[activeElement.id]
                    ? images[activeElement.id]["tag"]
                    : ""
                }
              />
              <input
                type="checkbox"
                onChange={this.toggleCheck}
                checked={
                  activeElement && images && images[activeElement.id]
                    ? images[activeElement.id]["hasTag"]
                    : false
                }
              />
            </div>

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id === `${activeElement.id}_image_tag`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e => this.handleAutoCompleteOptionClick(e, "tag")}
              />
            </div>

            <p>
              {" "}
              <Translator string="generalDiscription" />{" "}
            </p>
            <textarea
              className="img-popup-textarea"
              onChange={e => this.handleChange(e, "description")}
              placeholder={translator("imgPopupTextarea", titles)}
              value={
                activeElement && images[activeElement.id]
                  ? images[activeElement.id]["description"]
                  : ""
              }
            ></textarea>

            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptionsPopup &&
                  activeAutoCompleteItem &&
                  activeElement &&
                  activeAutoCompleteItem.id ===
                    `${activeElement.id}_image_description`
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={e =>
                  this.handleAutoCompleteOptionClick(e, "description")
                }
              />
            </div>
          </div>

          <div className="pop-up-bottons-wrapper">
            <button className="pop-up-button" onClick={this.submit}>
              <Translator string="ok" />
            </button>
            <button className="pop-up-button" onClick={this.cancel}>
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
    show: state.workplacePopups.image,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,

    /* show error message when validation is error upon submitting */
    showFormNamelessError: state.messages.showFormNamelessError,
    images: state.workplaceElements.images,
    activeDetails: state.formDetails.activeDetails,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showAutoCompleteOptionsPopup: state.translation.showAutoCompleteOptions,
    selectedForm: state.activeItems.selectedForm,
    activeAutoCompleteItem: state.activeItems.activeAutoCompleteItem,
    newWords: state.translation.newWords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagePopup);
