import React, { Component } from "react";
import { Translator } from "../../components/utils";
import { updateData } from "../../store/actions/rootActions";
import { connect } from "react-redux";

class Search extends Component {
  state = { text: "" };

  handleChange = e => this.setState({ text: e.target.value });

  render = () => {
    return (
      <div
        className="search-wrapper"
        onClick={() => this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", null)}
      >
        <input
          type="text"
          className="search-input"
          value={this.state.text}
          onChange={this.handleChange}
        />

        <button className="search-button">
          <Translator string = 'go' />
        </button>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    /* hide right sidebar element */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Search);
