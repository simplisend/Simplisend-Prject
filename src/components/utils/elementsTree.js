import React, { Component, Fragment } from "react";
import { updateData } from "../../store/actions/rootActions";
import DroppableComponent from "./droppable";
import DraggableComponent from "./draggable";
import { connect } from "react-redux";
import Translator from "./translator";
import { getRequest } from "../../funcs/http";
import Select from "react-select";

class ElementsTree extends Component {
  state = {
    loading: false, // when user getting all ids
    formContainer: null, // when user opens form tab
    paperContainer: null, // when user opens paper tab
    paperBlocks: null,
    all: null, // when user requests all ids
    showPaperBlocks: false,
    options: [
      { label: "Elements", value: "elements" },
      { label: "All", value: "all" }
    ],
    selectedOption: { label: "Elements", value: "elements" },
    empty: []
  };

  // set method (what elements to get in the tree )
  // set id to be used in foor loop in render
  setMethodAndKey = () => {
    const { currentActivePage } = this.props;
    const { selectedOption } = this.state;

    let action;
    if (currentActivePage === "formContainer") {
      action = this.getContainers;
    } else if (
      currentActivePage === "paperContainer" &&
      selectedOption.value === "elements"
    ) {
      action = this.getAllElements;
    } else {
      action = this.getAllIds;
    }
    return { action };
  };

  componentDidMount = () => {
    const { droppables, droppableName } = this.props;
    if (droppables[droppableName]) {
      const { action } = this.setMethodAndKey();
      action();
    }
  };

  handleSelect = option => this.setState({ selectedOption: option });

  componentDidUpdate = (prevProps, prevState) => {
    const { droppables, droppableName, currentActivePage } = this.props;

    if (
      prevProps.droppables &&
      droppables &&
      Object.keys(prevProps.droppables).length === 0 &&
      Object.keys(droppables).length > 0
    ) {
      const { action } = this.setMethodAndKey();
      action();
      return;
    }

    // when user opens a new form
    if (
      prevProps.droppables[prevProps.droppableName] &&
      !droppables[droppableName]
    ) {
      this.setState({ formContainer: null, paperContainer: null, all: null });
      return;
    }

    if (
      !prevProps.droppables["paperWorkplaceElements"] &&
      this.props.droppables["paperWorkplaceElements"]
    ) {
      this.setState({
        paperBlocks: [...droppables["paperWorkplaceElements"]]
      });
      return;
    }

    if (
      droppables["paperWorkplaceElements"] &&
      prevProps.droppables["paperWorkplaceElements"] &&
      prevProps.droppables["paperWorkplaceElements"].length !==
        droppables["paperWorkplaceElements"].length
      //this.state.paperBlocks
    ) {
      const length = droppables["paperWorkplaceElements"].length;
      this.setState({
        paperBlocks: [
          ...this.state.paperBlocks,
          droppables["paperWorkplaceElements"][length - 1]
        ]
      });
      return;
    }
    // when user addes new workplace element (heading,askAnswer , notification)
    if (
      droppables[droppableName] &&
      prevProps.droppables[prevProps.droppableName] &&
      prevProps.droppables[prevProps.droppableName].length !==
        droppables[droppableName].length
    ) {
      const length = droppables[droppableName].length;

      if (currentActivePage === "formContainer") {
        this.setState({
          [currentActivePage]: [
            ...this.state.formContainer,
            droppables[droppableName][length - 1]
          ],
          paperContainer: null
        });
      }
      return;
    }

    // when user selects the getAll ids option
    if (
      prevState.selectedOption !== this.state.selectedOption &&
      this.state.selectedOption.value === "all" &&
      !this.state.all
    ) {
      this.getAllIds();
      return;
    }

    // when user gets data for the first time
    if (
      !prevProps.droppables[prevProps.droppableName] &&
      droppables[droppableName]
    ) {
      const { action } = this.setMethodAndKey();
      action();
      return;
    }

    // when user changes current active tab then get it's corresponding data
    if (
      prevProps.currentActivePage &&
      prevProps.currentActivePage !== currentActivePage &&
      !this.state[currentActivePage]
    ) {
      if (droppables[droppableName]) {
        const { action } = this.setMethodAndKey();
        action();
        return;
      }
    }
  };

  getPageBlocks = () => {
    const { droppables } = this.props;
    if (this.state.paperBlocks) {
      this.setState({ showPaperBlocks: true });
      return;
    }

    if (droppables["paperWorkplaceElements"]) {
      const data = droppables["paperWorkplaceElements"].map(item => item);
      this.setState({
        paperBlocks: data,
        showPaperBlocks: true
      });
      return;
    }

    this.setState({ showPaperBlocks: true });
    this.props.updateData("SET_RIGHT_DROPPABLE_ACTIVE", false);
  };

  // get elements inside containers
  getAllElements = () => {
    const { activeDetails } = this.props;
    const data = [];

    activeDetails &&
      Object.keys(activeDetails).map(key => {
        const item = activeDetails[key];
        const added = [];
        if (Array.isArray(item)) {
          item.map(obj => {
            if (obj.inputId && obj.type && added.indexOf(obj.inputId) === -1) {
              data.push({ ...obj, type: "block" });
              added.push(obj.inputId);
            }
            return null;
          });
        } else if (item.description) {
          data.push({ ...item, type: "block" });
        }

        return null;
      });
    console.log(data);
    this.setState({ paperContainer: data });
    this.props.updateData("ADD_DROPPABLE", {
      column: data
    });
    this.props.updateData("SET_RIGHT_DROPPABLE_ACTIVE", true);
  };

  // render only containers
  getContainers = () => {
    const { droppables, droppableName } = this.props;
    const data = droppables[droppableName].map(item => item);
    this.setState({ formContainer: data });
    this.props.updateData("SET_RIGHT_DROPPABLE_ACTIVE", false);
  };

  // get all ids in database
  getAllIds = () => {
    this.setState({ loading: true });
    getRequest("forms/get_all_ids").then(resp => {
      this.setState({
        all: resp.data,
        loading: false,
        draggableId: "id"
      });
      this.props.updateData("SET_RIGHT_DROPPABLE_ACTIVE", true);
    });
  };

  render = () => {
    const { currentActivePage, droppables, droppableName } = this.props;
    const { selectedOption } = this.state;
    let k, displayValue, dragKey;

    if (selectedOption.value === "all") {
      k = "all";
      displayValue = "inputId";
      dragKey = "id";
    } else if (
      this.state.showPaperBlocks &&
      !droppables["paperWorkplaceElements"]
    ) {
      k = "empty";
      displayValue = null;
    } else if (
      this.state.showPaperBlocks &&
      droppables["paperWorkplaceElements"] &&
      currentActivePage === "paperContainer"
    ) {
      k = "paperBlocks";
      displayValue = "droppable";
      dragKey = "droppable";
    } else {
      k = currentActivePage;
      displayValue = "inputId";
      dragKey = "id";
    }
    const data = this.state[k];

    return (
      <Fragment>
        <div className="sB_Titel">
          <Translator string="heading" />
        </div>
        {currentActivePage === "paperContainer" && (
          <Fragment>
            {k !== "all" && (
              <Fragment>
                <button
                  onClick={() =>
                    this.setState({
                      showPaperBlocks: false
                    })
                  }
                  style={{
                    padding: 10,
                    backgroundColor: !this.state.showPaperBlocks
                      ? "#444"
                      : "#eee"
                  }}
                >
                  Elements
                </button>
                <button
                  onClick={this.getPageBlocks}
                  style={{
                    border: "none",
                    padding: 10,
                    backgroundColor: this.state.showPaperBlocks
                      ? "#444"
                      : "#eee"
                  }}
                >
                  blocks
                </button>
              </Fragment>
            )}

            <Select
              options={this.state.options}
              value={this.state.selectedOption}
              onChange={this.handleSelect}
            />
          </Fragment>
        )}

        <div className="elements-tree">
          {selectedOption.value === "all" && !this.state.all && (
            <h3>Loading ...</h3>
          )}

          <DroppableComponent
            droppableId={
              !this.state.showPaperBlocks
                ? droppableName
                : "paperWorkplaceElements"
            }
            draggingColor="lightblue"
            isDropDisabled={this.props.disabled && !this.state.showPaperBlocks}
          >
            {data &&
              dragKey &&
              data.map((item, i) => {
                // console.log(item);
                // console.log(dragKey);
                // console.log(item[dragKey]);
                // console.log(
                //   "--------------------------------------------------------"
                // );
                return (
                  <DraggableComponent
                    draggableId={item[dragKey]}
                    index={i}
                    key={item[dragKey]}
                  >
                    <div className="sb_sidebarButton">
                      <div className="btn-Text">
                        {currentActivePage === "formContainer" ||
                        (currentActivePage === "paperContainer" &&
                          this.state.showPaperBlocks) ? (
                          <Translator string="element" />
                        ) : item[displayValue] ? (
                          item[displayValue]
                        ) : (
                          item["tag"]
                        )}
                      </div>
                    </div>
                  </DraggableComponent>
                );
                //  }
              })}
          </DroppableComponent>
        </div>
      </Fragment>
    );
  };
}

const mapStoreToProps = state => {
  return {
    droppables: state.droppables.droppables,
    formDetails: state.formDetails.details,
    activeDetails: state.formDetails.activeDetails,

    /* which workplace tab is active (paper,form ....) this will be used to decide what elements to render */
    currentActivePage: state.workplace.currentActivePage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(ElementsTree);
