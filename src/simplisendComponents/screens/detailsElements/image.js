import React, { Component } from "react";
import { connect } from "react-redux";

class Image extends Component {
  render = () => {
    const { data, formDetails, activeFormDetails } = this.props;
    let description, width, height, url, hasTag, tag;
    if (formDetails[activeFormDetails.id]) {
      description =
        formDetails[activeFormDetails.id][data[0]["id"]]["description"];
      width = formDetails[activeFormDetails.id][data[0]["id"]]["user_width"];
      height = formDetails[activeFormDetails.id][data[0]["id"]]["user_height"];
      url = formDetails[activeFormDetails.id][data[0]["id"]]["url"];
      hasTag = formDetails[activeFormDetails.id][data[0]["id"]]["hasTag"];
      tag = formDetails[activeFormDetails.id][data[0]["id"]]["tag"];
    }
    
    return (
      <div className="block-container">
        {description && <p id="shorttext-question">{this.props.words[description]['content']}</p>}
        <div className="block-element-row">
          {hasTag && <p className="answer-tag">{this.props.words[tag]['content']}</p>}
          <img
            className="img"
            alt="img"
            src={url}
            style={{ width: Number(width), height: Number(height) }}
          />
        </div>
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

export default connect(mapStateToProps)(Image);
