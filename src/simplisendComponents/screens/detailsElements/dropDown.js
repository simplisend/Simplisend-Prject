import React, { Component, Fragment } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";

class DropDown extends Component {
  state = { options: null, selectedOption: null };

  componentDidMount = () => {
    const {
      formDetails,
      activeFormDetails,
      data,
      updateFilteredItems
    } = this.props;
    const { isRequired } = formDetails[activeFormDetails.id][data[0]["id"]][0];
    const { id } = formDetails[activeFormDetails.id][data[0]["id"]][1];
    const choosed = formDetails[activeFormDetails.id][data[0]["id"]].filter(
      item => {
        return item.selected;
      }
    );

    if (choosed.length) {
      const selected = {
        ...choosed[0],
        label: choosed[0]["title"],
        value: choosed[0]["title"]
      };
      this.setState({ selectedOption: selected });
    }

    if (isRequired) {
      this.props.updateData("ADD_REQUIRED_ELEMENT", {
        key: id,
        value: choosed.length > 0 ? choosed[0]["id"] : ""
      });
    }

    // if any option was checked then add this item to filtered items
    if (this.state.selectedOption) {
      const key = data[0]["id"];
      const item = formDetails[activeFormDetails.id][key];
      updateFilteredItems(key, item);
    }
  };

  /* when user opens form for first time */
  componentWillMount = () => {
    const { options } = this.state;
    const { data, formDetails, activeFormDetails, words } = this.props;
    if (!options && formDetails[activeFormDetails.id]) {
      let i = 0;
      let opts = [];
      for (
        i;
        i < formDetails[activeFormDetails.id][data[0]["id"]].length;
        i++
      ) {
        const item = formDetails[activeFormDetails.id][data[0]["id"]][i];
        if (item.type === "dropdown_option") {
          opts.push({
            ...item,
            label: words[item.title]["content"],
            value: item.title
          });
        }
      }

      this.setState({ options: opts });
    }
  };

  // select a value from dropdown
  handleChange = item => {
    const { formDetails, activeFormDetails, data } = this.props;
    const { id } = formDetails[activeFormDetails.id][data[0]["id"]][1];
    const updatedDropDown = formDetails[activeFormDetails.id][
      data[0]["id"]
    ].map(obj => {
      if (obj.id === item.id) {
        return { ...obj, selected: true };
      } else {
        return { ...obj, selected: false };
      }
    });

    const updatedDetails = {
      ...formDetails[activeFormDetails.id],
      [data[0]["id"]]: updatedDropDown
    };

    this.handleFilter();
    this.props.updateData("SET_FORM_DETAILS", {
      key: activeFormDetails.id,
      type: "details",
      details: updatedDetails
    });

    this.props.updateData("ADD_REQUIRED_ELEMENT", {
      key: id,
      value: "selected"
    });

    this.setState({ selectedOption: item });
  };

  // if user filtered data then this item should be added to the filtered items upon choosing
  handleFilter = () => {
    const { formDetails, activeFormDetails, data, filterData } = this.props;
    if (!filterData) {
      const key = data[0]["id"];

      this.props.updateFilteredItems(
        key,
        formDetails[activeFormDetails.id][data[0]["id"]]
      );
    }
  };

  /* when user updates form from simpliBuilder and reopen it */
  componentDidUpdate = (prevProps, prevState) => {
    const { formDetails, activeFormDetails, data, words } = this.props;
    const keys = Object.keys(words);

    if (
      prevProps.words[keys[0]]["content"] !==
      this.props.words[keys[0]]["content"]
    ) {
      const updatedOptions = [];
      let i = 0;
      for (
        i;
        i < formDetails[activeFormDetails.id][data[0]["id"]].length;
        i++
      ) {
        const item = formDetails[activeFormDetails.id][data[0]["id"]][i];
        if (item.type === "dropdown_option") {
          updatedOptions.push({
            ...item,
            label: words[item.title]["content"],
            value: item.title
          });
        }
      }

      this.setState({ options: updatedOptions });
    }

    // when user empty all inputs
    if (prevProps.emptyDropLists !== this.props.emptyDropLists) {
      this.setState({ selectedOption: null });
    }

    // when user autofill all inputs
    if (!prevProps.autoFilled && this.props.autoFilled) {
      this.findSelectedValue();
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

  // when user autofill inputs then update dropdown immediately
  findSelectedValue = () => {
    const { formDetails, activeFormDetails, data } = this.props;
    const _data = formDetails[activeFormDetails.id][data[0]["id"]].slice(2);
    let i = 0;
    for (i; i < _data.length; i++) {
      const item = _data[i];
      if (item.selected) {
        this.setState({
          selectedOption: { value: item.title, label: item.title }
        });
        break;
      }
    }
  };

  render = () => {
    const { options } = this.state;
    const { data, activeFormDetails, formDetails, words } = this.props;
    let tag;
    let placeholder = "";

    const question =
      formDetails[activeFormDetails.id][data[0]["id"]][0]["value"];

    if (formDetails[activeFormDetails.id]) {
      if (words[formDetails[activeFormDetails.id][data[0]["id"]][1]["tag"]]) {
        tag =
          words[formDetails[activeFormDetails.id][data[0]["id"]][1]["tag"]][
            "content"
          ];
      } else {
        tag = ""; //formDetails[activeFormDetails.id][data[0]["id"]][1]["tag"]
      }

      placeholder =
        words[formDetails[activeFormDetails.id][data[0]["id"]][1]["title"]][
          "content"
        ];
    }

    return (
      <Fragment>
        <div className="block-container">
          {options && formDetails[activeFormDetails.id] && (
            <div>
              <h2 className="dropdown-question">
                {words[question]["content"]}
              </h2>
              {formDetails &&
                formDetails[activeFormDetails.id] &&
                formDetails[activeFormDetails.id][data[0]["id"]][0][
                  "generalDiscription"
                ] && (
                  <div
                    id="btn-description"
                    onClick={() => this.setActiveGeneralDiscription("activate")}
                  >
                    !
                  </div>
                )}
              <div className="block-element-row">
                {formDetails[activeFormDetails.id][data[0]["id"]][0][
                  "hasTag"
                ] &&
                formDetails[activeFormDetails.id][data[0]["id"]][0][
                  "isRequired"
                ] === true ? (
                  <p className="answer-tag required">{tag}</p>
                ) : (
                  <p className="answer-tag">{tag}</p>
                )}
                <div className="answer-input dropdown">
                  <Select
                    className="drop-menu"
                    options={[...options]}
                    onChange={this.handleChange}
                    value={this.state.selectedOption}
                    placeholder={placeholder}
                  />
                  {this.state.selectedOption && (
                    <p>
                      {words[this.state.selectedOption.label] &&
                        words[this.state.selectedOption.label]["content"]
                      //this.state.selectedOption.label
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(DropDown);
