import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import ShortTextItem from "./shortTextItem";

class ShortText extends Component {

  // show general discription (if this element has one)
  setActiveGeneralDiscription = action => {
    const { formDetails, activeFormDetails, data,words } = this.props;
    
    if (action === "activate") {
      const string =
        formDetails[activeFormDetails.id][data[0]["id"]][0][
          "generalDiscription"
        ];
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeGeneralDiscription",
        item: words[string]['content']
      });
      return;
    }

    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeGeneralDiscription",
      item: null
    });
  };


  render = () => {
    const { 
      data, 
      formDetails, 
      activeFormDetails, 
      words,
      shortTextsRequiredIndexes ,
      shortTextsNoneRequiredIndexes ,
      updateShortTextIndexes
    } = this.props;
   
    return (
      <div className="block-container">
        {data && data.map((item, i) => {
          return (
            formDetails[activeFormDetails.id] &&
            formDetails[activeFormDetails.id][item.id].map((obj, i) => {
              if (obj.hasTag !== undefined) {
                return (
                  <ShortTextItem
                    
                    filterData={this.props.filterData}
                    updateFilteredItems={this.props.updateFilteredItems}
                    key={obj.id}
                    {...obj}
                    index={i}
                    container={item.id}
                    formId={item.id}
                    value={obj.value}
                    id={data[0]["id"]}
                    words = {this.props.words}
                    requiredIndexes = { shortTextsRequiredIndexes }
                    noneRequiredIndexes = {shortTextsNoneRequiredIndexes}
                    updateShortTextIndexes = {updateShortTextIndexes}
                    
                  />
                );
              }
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
                </div>
              );
            })
          );
        })}
      </div>
    );
  };
}

//addToExceptions={this.props.addToExceptions}

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

export default connect(mapStateToProps, mapDispatchToProps)(ShortText);
