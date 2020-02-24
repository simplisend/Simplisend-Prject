import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import TextItem from "./textItem";
import {
  ClickOutsideComponent,
  ClickOutsideOptionsList
} from "../../../components/utils";
import icons from "../../../configs/icons";

import Select from "react-select";

/* DropList Component in left sidebar */
class DropDown extends Component {
  state = { options: null };

  componentWillMount = () => {
    const { options } = this.state;
    const { activeDetails, id } = this.props;
    if (!options && activeDetails && activeDetails[id]) {
      const elements = activeDetails[id].map(item => {
        return { ...item, label: item.title, value: item.title };
      });
      this.setState({ options: elements });
    }
  };

  /* open element popup to modify*/
  openPopup = e => {
    const { activeDetails, id } = this.props;
    this.props.updateData("SHOW_DROPLIST", true);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", { id });
    const elements = [];
    activeDetails[id].map(item => {
      if (item.type !== "dropdown_option") {
        elements.push({ ...item });
      }
      return null;
    });

    this.props.updateData("SET_DROPDOWNS", {
      key: id,
      dropDowns: elements,
      title: "dropList"
    });
    e.preventDefault();
  };

  /* open popup for each dropdown element */
  openDetailsPopup = (e, item, index) => {
    const { id, activeDetails } = this.props;
    const itemsCount = activeDetails[id][index]["itemsCount"];

    /* if there are dropdown items then send them to popup*/
    if (itemsCount > 0) {
      this.props.updateData("SET_DROPDOWN_ITEMS", {
        key: item.id,
        items: activeDetails[id].slice(index + 1, index + 1 + itemsCount)
      });
    }

    this.props.updateData("SHOW_DROPLIST_DETAILS", true);
    /*
      id : id belongs to this dropdown item
      parentId : id belongs to the whole dropdown  that contains all the dropdown items
    */
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", {
      id: item.id,
      title: item.title,
      tag: item.tag,
      parentId: id,
      hasTag: item.hasTag,
      index
    });

    e.preventDefault();
  };

  /* change content of dropdown ask and all dropdowns */
  handleChange = e => {
    const { activeWorkplaceElement } = this.props;
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
      ...activeWorkplaceElement,
      value: e.target.value
    });
  };

  /* change content of dropdown ask */
  updateDropDownAsk = () => {
    const {
      activeDetails,
      id,
      activeWorkplaceElement,
      selectedForm
    } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    updatedFormDetails[0]["value"] = activeWorkplaceElement.value;
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedFormDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
    this.props.updateData("ADD_NEW_WORD", {
      key: `${id}_ask`,
      text: {
        content: activeWorkplaceElement.value,
        translation_id: null,
        language: selectedForm.default_lang.id
      }
    });
  };

  /* wrap the update logic in one method */
  update = () => {
    const { activeWorkplaceElement } = this.props;
    if (activeWorkplaceElement.type === "ask") {
      this.updateDropDownAsk();
    } else {
      this.updateDropDownItem();
    }
  };

  /* change title of dropdowns */
  updateDropDownItem = () => {
    const { activeDetails, id, activeWorkplaceElement } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    updatedFormDetails[activeWorkplaceElement.index]["title"] =
      activeWorkplaceElement.value;
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedFormDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
  };

  /* pass this method to TextItem component */
  handleKeyPress = e => {
    const { activeWorkplaceElement } = this.props;
    if (e.key === "Enter" && activeWorkplaceElement) {
      activeWorkplaceElement.type === "ask"
        ? this.updateDropDownAsk()
        : this.updateDropDownItem(e);
    }
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

  /* when user click on one of auto-complete option */
  handleAutoCompleteOptionClick = item => {
    const { activeDetails, id } = this.props;
    const updatedFormDetails = [...activeDetails[id]];
    updatedFormDetails[0]["value"] = item.content;
    this.props.updateData("SET_FORM_DETAILS", {
      key: id,
      details: updatedFormDetails,
      type: "activeDetails"
    });
    this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", null);
    this.props.updateData("ADD_NEW_WORD", { key: `${id}_ask`, text: item });
    this.closeAutoCompleteOptions();
  };

  handleClick = () => {
    const { selected, activeDetails, id } = this.props;

    const { isRequired } = activeDetails[id][0];

    if (selected.indexOf("btn-Requierd") !== -1) {
      this.props.updateData("SET_FORM_DETAILS", {
        key: id,
        details: [
          { ...activeDetails[id][0], isRequired: !isRequired },
          ...activeDetails[id].slice(1)
        ],
        type: "activeDetails"
      });
    }
  };

  render = () => {
    const {
      id,
      activeDetails,
      activeWorkplaceElement,
      showAutoCompleteOptions,
      autoCompleteActiveItem,
      autoCompleteOptions,
      active,
      selected
    } = this.props;

    const { options } = this.state;
    const selectedBtnActive = selected.indexOf("btn-Requierd") !== -1;

    return (
      <div
        style={{ cursor: selectedBtnActive ? "pointer" : "default" }}
        onClick={this.handleClick}
      >
        <div className="dropped_content">
          <div
            className="question-container"
            style={{
              cursor: selectedBtnActive ? "pointer" : "none",
              pointerEvents: selectedBtnActive ? "none" : "auto"
            }}
          >
            {activeDetails[id] && activeDetails[id].length && (
              <div
                style={{
                  pointerEvents: selectedBtnActive ? "none" : "auto"
                }}
              >
                <ClickOutsideComponent
                  handleClick={this.update}
                  condition={
                    activeWorkplaceElement &&
                    activeWorkplaceElement.id === id &&
                    !showAutoCompleteOptions
                  }
                >
                  <TextItem
                    value={
                      activeWorkplaceElement && activeWorkplaceElement.id === id
                        ? activeWorkplaceElement.value
                        : activeDetails && activeDetails[id]
                        ? activeDetails[id][0]["value"]
                        : ""
                    }
                    activate={() =>
                      this.props.updateData("SET_ACTIVE_WORKPLACE_ELEMENT", {
                        id,
                        value: activeDetails[id][0]["value"],
                        type: "ask",
                        index: 0
                      })
                    }
                    edit={
                      activeWorkplaceElement && activeWorkplaceElement.id === id
                    }
                    handleChange={this.handleChange}
                    handleKeyPress={e => this.handleKeyPress(e)}
                    autoFocus={true}
                    cls="question-input"
                    id={id}
                  ></TextItem>
                </ClickOutsideComponent>
              </div>
            )}
            {active && active === "btn-Divide" && (
              <div className="details-btn" onClick={this.openPopup}>
                {icons.property}
              </div>
            )}
            <div className="shorttext-options-conainer">
              <ClickOutsideOptionsList
                hide={this.closeAutoCompleteOptions}
                show={
                  showAutoCompleteOptions &&
                  autoCompleteActiveItem &&
                  autoCompleteActiveItem.id === id
                }
                options={autoCompleteOptions ? autoCompleteOptions : []}
                renderKey="content"
                handleClick={this.handleAutoCompleteOptionClick}
                noDataHandleClick={this.update}
                noDataCondition={activeWorkplaceElement !== null}
              />
            </div>
          </div>
        </div>

        {options &&
          options.slice(1).map((item, i) => {
            if (item.type !== "dropdown_option") {
              return (
                <div
                  className="workplace-droppable-item block-element-row"
                  key={item.id}
                  style={{
                    pointerEvents: selectedBtnActive ? "none" : "auto"
                  }}
                >
                  {activeDetails[id][1]["hasTag"] && (
                    <div>
                      {activeDetails[id][0]["isRequired"] === true ? (
                        <p className="required">
                          {activeDetails[id][1]["tag"]}
                        </p>
                      ) : (
                        <p>{activeDetails[id][1]["tag"]}</p>
                      )}
                    </div>
                  )}

                  <div className="input-row">
                    <Select
                      options={[
                        ...options.slice(i + 2, i + 2 + item["itemsCount"])
                      ]}
                      placeholder={item.label}
                    />
                    {active && active === "btn-Divide" && (
                      <span
                        onClick={e => this.openDetailsPopup(e, item, i + 1)}
                        className="details-btn"
                      >
                        {icons.property}
                      </span>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    activeDetails: state.formDetails.activeDetails,
    activeWorkplaceElement: state.workPlacePage.activeWorkplaceElement,
    autoCompleteOptions: state.translation.autoCompleteOptions,
    showAutoCompleteOptions: state.translation.showAutoCompleteOptions,
    autoCompleteActiveItem: state.activeItems.autoCompleteActiveItem,
    selectedForm: state.activeItems.selectedForm,
    active: state.formToolBar.selectEditActive,
    /* which header buttons is selected now*/
    selected: state.formToolBar.selected
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
)(DropDown);
