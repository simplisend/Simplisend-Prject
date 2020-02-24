import React, { Component } from "react";
import { connect } from "react-redux";
import { Translator } from "../../../components/utils";

class FormSubmitButton extends Component {
  state = { disabled: true };

  componentDidMount = () => {
    const result = this.check();
    if (result) {
      this.setState({ disabled: true });
    }

    if (Object.keys(this.props.requiredElements).length === 0) {
      this.setState({ disabled: false });
    }
  };

  componentDidUpdate = (prevsProps, prevState) => {
    const result = this.check();
    if (result === this.state.disabled) {
      this.setState({ disabled: !result });
    }
  };

  check = () => {
    let i = 0;
    const { requiredElements } = this.props;
    const keys = Object.keys(requiredElements);

    const len = keys.length;
    let result = true;
    while (i < len && result) {
      const key = keys[i];
      if (!requiredElements[key]) {
        result = false;
      }
      i++;
    }
    return result;
  };

  render = () => {
    return (
      <button
        disabled={this.state.disabled}
        className={
          this.state.disabled ? "disabled-form-submit-btn" : "form-submit-btn"
        }
        onClick={() => console.log("asdasda")}
      >
        <Translator string="exportPdf" />
      </button>
    );
  };
}

const mapStateToProps = state => {
  return {
    requiredElements: state.formDetails.requiredElements
  };
};

export default connect(
  mapStateToProps
  //mapDispatchToProps
)(FormSubmitButton);
