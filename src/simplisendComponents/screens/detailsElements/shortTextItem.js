import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import TextareaAutosize from "react-autosize-textarea";

class ShortTextItem extends Component {


  componentDidMount = () => {
    const { isRequired, id, value } = this.props;

    if (isRequired) {
      this.props.updateData("ADD_REQUIRED_ELEMENT", { key: id, value });
    }
  };



  // onChange will use this method to to check wether the parent of this component 
  // (shortText ) should be filtered out when user filter elements 
  handleFilter = value => {
    const { requiredIndexes,updateShortTextIndexes,id,index } = this.props;  
    
      if(typeof(requiredIndexes[id][index]) === 'string') {
        updateShortTextIndexes('requiredIndexes',id,index,value) ; 
      } else {
        updateShortTextIndexes('noneRequiredIndexes',id,index,value) ; 
      }
  };

  // when user fill in the input
  handleChange = e => {
    const { formDetails, index, container, activeFormDetails, id } = this.props;

    const updatedItem = {
      ...formDetails[activeFormDetails.id][container][index]
    };
    updatedItem["value"] = e.target.value;
    const updatedBlock = [...formDetails[activeFormDetails.id][container]];
    updatedBlock[index] = updatedItem;
    const updatedDetails = {
      ...formDetails[activeFormDetails.id],
      [container]: updatedBlock
    };
    this.handleFilter(e.target.value);
    this.props.updateData("SET_FORM_DETAILS", {
      type: "details",
      key: activeFormDetails.id,
      details: updatedDetails
    });

    if (updatedItem.isRequired) {
      this.props.updateData("ADD_REQUIRED_ELEMENT", {
        key: id,
        value: e.target.value
      });
    }
  };

  render = () => {
    const { value, hasTag, tag, isRequired,words } = this.props;
   
    return (
      <div className="block-element-row">
        {hasTag && isRequired === true ? (
          <p className="answer-tag required">{words[tag] && words[tag]['content'] }</p>
        ) : (
          <p className="answer-tag">{words[tag] && words[tag]['content']  }</p>
        )}

        <TextareaAutosize
          type="text"
          value={value}
          className="answer-input"
          onChange={this.handleChange}
        />
      </div>
    );
  };
}

//onFocus={this.onFocus}

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

export default connect(mapStateToProps, mapDispatchToProps)(ShortTextItem);
