import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import Translator from "../utils/translator";

class SelectLanguage extends Component {
  showLangChoice = () => {
    this.props.updateData("SS_SHOW_LANG-CHOISE", true);
  };

  render = () => {
    return (
      <div className="language-nav">
        <ul className="warpper">
          <li className="dropped_wrapper" onClick={this.showLangChoice}></li>
        </ul>
        <div className="dropLogo">
          <Translator string="language" />
        </div>
      </div>
    );
  };
}

const mapStateDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(null, mapStateDispatchToProps)(SelectLanguage);
