import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import ShortTextItem from "./shortTextItem";
// test

class TextBlock extends Component {
  setActiveGeneralDiscription = action => {
    const { formDetails, activeFormDetails, data,words } = this.props;
    
    if (action === "activate") {
      const string =
        words[formDetails[activeFormDetails.id][data[0]["id"]][0][
          "generalDiscription"
        ]] &&  words[formDetails[activeFormDetails.id][data[0]["id"]][0][
          "generalDiscription"
        ]]['content'] 
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeGeneralDiscription",
        item: string
      });
      return;
    }

    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeGeneralDiscription",
      item: null
    });
  };

  render = () => {
    const { data, formDetails, activeFormDetails } = this.props;
    
    return (
      <div className="block-container">
        {data.map((item, i) => {
          return (
            formDetails[activeFormDetails.id][item.id] &&
            formDetails[activeFormDetails.id][item.id].map((obj, i) => {
              if (obj.hasTag !== undefined) {
                return (
                  <ShortTextItem
                    key={obj.id}
                    {...obj}
                    index={i}
                    container={item.id}
                    formId={item.id}
                    value={obj.value}
                    words = {this.props.words}
                  />
                );
              }

              return (
                <div key={i}>
                  <p id="shorttext-question">{this.props.words[obj.value] && this.props.words[obj.value]['content']}</p>

                  <div
                    id="btn-description"
                    onClick={() => this.setActiveGeneralDiscription("activate")}
                  >
                    !
                  </div>
                </div>
              );
            })
          );
        })}
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
    language: state.lang.lang,
    formDetails: state.formDetails.details,
    activeWorkplaceElement: state.workPlacePage.activeWorkplaceElement,
    activeFormDetails: state.activeItems.activeFormDetails
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TextBlock);
