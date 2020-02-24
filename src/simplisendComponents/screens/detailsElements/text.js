import React, { Component } from "react";
import { connect } from "react-redux";

class Text extends Component {
  render = () => {
    const { data, formDetails, activeFormDetails, words } = this.props;

    return (
      <div className="block-container">
        {formDetails[activeFormDetails.id] &&
          data.map((item, i) => {
            if (formDetails && formDetails[activeFormDetails.id][item.id]) {
              return formDetails[activeFormDetails.id][item.id].map(
                (obj, i) => {
                  return (
                    <p
                      key={obj.id}
                      className={
                        obj.type === "textArea" ? "text-block" : "header-block"
                      }
                    >
                      {words[obj.title]["content"]}
                    </p>
                  );
                }
              );
            }
            return null;
          })}
      </div>
    );
  };
}

//{obj.title}
const mapStateToProps = state => {
  return {
    formDetails: state.formDetails.details,
    activeFormDetails: state.activeItems.activeFormDetails
  };
};

export default connect(mapStateToProps)(Text);
