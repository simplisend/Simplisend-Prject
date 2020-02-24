import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";

class RadioCheck extends Component {
  componentDidMount = () => {
    const { activeFormDetails, formDetails, data } = this.props;
    const { isRequired, id } = formDetails[activeFormDetails.id][
      data[0]["id"]
    ][0];

    if (isRequired) {
      const checked = formDetails[activeFormDetails.id][data[0]["id"]].filter(
        item => {
          return item.checked;
        }
      );

      this.props.updateData("ADD_REQUIRED_ELEMENT", {
        key: id,
        value: checked.length !== 0 ? checked[0]["id"] : ""
      });
    }
  };

  setActiveGeneralDiscription = action => {
    const { formDetails, activeFormDetails, data, words } = this.props;
    if (action === "activate") {
      const string =
        formDetails[activeFormDetails.id][data[0]["id"]][0][
          "generalDiscription"
        ];
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeGeneralDiscription",
        item: words[string]["content"]
      });
      return;
    }

    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeGeneralDiscription",
      item: null
    });
  };

  // if user filtered data then this item should be added to the filtered items upon checking
  handleFilter = item => {
    const {
      formDetails,
      activeFormDetails,
      data,
      filterData,
      filteredItems
    } = this.props;
    if (!filterData) {
      const key = data[0]["id"];

      // if item is checkbox  : if checked then remove it from filtered items else add it
      if (item.type === "checkBox") {
        if (item.checked) {
          this.props.updateFilteredItems(
            key,
            formDetails[activeFormDetails.id][data[0]["id"]]
          );
        } else {
          const updatedFilteredItems = { ...filteredItems };
          delete updatedFilteredItems[key];
          this.props.updateFilteredItems(
            key,
            null
            //formDetails[activeFormDetails.id][data[0]["id"]]
          );
        }
        // if radio then add it to filtered items
      } else {
        this.props.updateFilteredItems(
          key,
          formDetails[activeFormDetails.id][data[0]["id"]]
        );
      }
    }
  };

  handleCheckClick = (index, id) => {
    const { formDetails, activeFormDetails } = this.props;
    const updatedPart = formDetails[activeFormDetails.id][id];
    updatedPart[index] = {
      ...updatedPart[index],
      checked: !updatedPart[index]["checked"]
    };
    const updatedDetails = {
      ...formDetails[activeFormDetails.id],
      [id]: updatedPart
    };

    this.handleFilter(updatedPart[index]);

    this.props.updateData("SET_FORM_DETAILS", {
      key: activeFormDetails.id,
      type: "details",
      details: updatedDetails
    });

    this.props.updateData("ADD_REQUIRED_ELEMENT", {
      key: id,
      value: "checked"
    });
  };

  handleRadioClick = (index, id) => {
    const { formDetails, activeFormDetails } = this.props;
    const updatedPart = formDetails[activeFormDetails.id][id].map((item, i) => {
      if (i === index) {
        return { ...item, checked: true };
      }
      return { ...item, checked: false };
    });

    const updatedDetails = {
      ...formDetails[activeFormDetails.id],
      [id]: updatedPart
    };

    this.handleFilter(updatedPart[index]);
    this.props.updateData("SET_FORM_DETAILS", {
      key: activeFormDetails.id,
      type: "details",
      details: updatedDetails
    });

    this.props.updateData("ADD_REQUIRED_ELEMENT", {
      key: id,
      value: "checked"
    });
  };

  render = () => {
    const { data, type, formDetails, activeFormDetails, words } = this.props;
    const inputType = type === "radioChoice" ? "radio" : "checkbox";

    return (
      <div className="block-container">
        {formDetails[activeFormDetails.id] &&
          data.map((item, i) => {
            return formDetails[activeFormDetails.id][item.id].map((obj, i) => {
              if (!obj.type) {
                return (
                  <div key={i}>
                    <p id="shorttext-question">{words[obj.value]["content"]}</p>
                    {obj.generalDiscription && (
                      <div
                        id="btn-description"
                        onClick={() =>
                          this.setActiveGeneralDiscription("activate")
                        }
                      >
                        !
                      </div>
                    )}

                    {obj.hasTag && obj.isRequired === true ? (
                      <p id="shorttext-question" className="required">
                        {words[obj.tag]["content"]}
                      </p>
                    ) : (
                      <p id="shorttext-question">
                        {words[obj.tag] && words[obj.tag]["content"] }
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <div className="block-element-row" key={obj.id}>
                  <input
                    className="radio-Check"
                    type={inputType}
                    checked={obj.checked}
                    onChange={
                      type === "checkBox"
                        ? () => this.handleCheckClick(i, item.id)
                        : () => this.handleRadioClick(i, item.id)
                    }
                    name={obj.tag}
                  />
                  <p className="check-answer-tag">
                    {words[obj.tag]["content"]}
                  </p>
                </div>
              );
            });
          })}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    formDetails: state.formDetails.details,
    activeFormDetails: state.activeItems.activeFormDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RadioCheck);
