import React, { Component } from "react";
import { Translator } from "../../../../../components/utils";
import { updateData } from "../../../../../store/actions/rootActions";
import { connect } from "react-redux";
import { request } from "../../../../../funcs/http";

class LoginForm extends Component {
  state = { username: "", password: "" };

  handleChange = (e, key) => {
    const value = e.target.value;
    const updatedBlock = {
      ...this.state,
      [key]: value
    };

    this.setState({ ...updatedBlock });
  };

  showRegister = () => {
    this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", "register");
  };

  login = () => {
    const { username, password } = this.state;
    const payload = { username, password };
    request("token/", payload).then(resp => {
      if (resp.status === 200) {
        localStorage.setItem("token", resp.data.token);
        this.props.updateData("AUTHORIZATION", true);
        this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", null);
        //this.props.history.push("/admin");
        return;
      }
    });
  };

  render = () => {
    return (
      <div className="content-wrapper_1">
        <div className="row_1">
          <div className="column_1">
            <label htmlFor="username" className="label">
              <Translator string="username" />
            </label>

            <input
              id="username"
              className="form-input"
              type="text"
              onChange={(e, key) => this.handleChange(e, "username")}
              value={this.state.username}
            />

            <label htmlFor="paassword" className="label">
              <Translator string="password" />
            </label>

            <input
              id="password"
              className="form-input"
              type="password"
              onChange={(e, key) => this.handleChange(e, "password")}
              value={this.state.password}
            />
          </div>
        </div>

        <div className="row_end">
          <div className="input-wrapper">
            <button onClick={this.login} className="form-button">
              <Translator string="login" />
            </button>
            <button onClick={this.showRegister} className="form-button">
              <Translator string="register" />
            </button>
          </div>
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LoginForm);
