import React, { Component } from "react";
import { Translator } from "../../components/utils";

class FormProps extends Component {
  render = () => {
    return (
      <div className="list-wrapper">
        <h3 className="tree-title">
          <Translator string="formProps" />
          <div
            className="sa-layoutToggler"
            onClick={() => this.props.updateData("SA-CLASS-TOGGLER")}
          ></div>
        </h3>
      </div>
    );
  };
}

export default FormProps;
