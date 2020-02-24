import React, { Component } from "react";
import { Translator } from "../../../../../components/utils";
import { request } from "../../../../../funcs/http";
import { connect } from "react-redux";
import { updateData } from "../../../../../store/actions/rootActions";

class RegisterForm extends Component {
  state = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    email_again: "",
    address: "",
    country: "",
    city: "",
    gender: "",
    day: "",
    month: "",
    year: "",
    userType: ""
  };

  handleChange = (e, key) => {
    const value = e.target.value;
    const updatedBlock = {
      ...this.state,
      [key]: value
    };

    this.setState({ ...updatedBlock });
  };

  register = () => {
    const {
      firstname,
      lastname,
      email,
      email_again,
      address,
      country,
      city,
      gender,
      password,
      username,
      userType
    } = this.state;
    if (email !== email_again) {
  
      return;
    }

    if (
      firstname &&
      lastname &&
      email &&
      email_again &&
      address &&
      country &&
      city &&
      gender &&
      password &&
      username &&
      userType
    ) {
      request("users/", this.state).then(resp => {
        
        return;
      });
    }
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
              name="username"
            />

            <label htmlFor="password" className="label">
              <Translator string="password" />
            </label>

            <input
              id="password"
              className="form-input"
              type="password"
              onChange={(e, key) => this.handleChange(e, "password")}
              value={this.state.password}
              name="password"
            />

            <label htmlFor="fname" className="label">
              <Translator string="firstname" />
            </label>

            <input
              id="fname"
              className="form-input"
              type="text"
              name="firstname"
              onChange={(e, key) => this.handleChange(e, "firstname")}
              value={this.state.firstname}
            />

            <label htmlFor="lname" className="label">
              <Translator string="lastname" />
            </label>

            <input
              id="lname"
              name="lastname"
              className="form-input"
              type="text"
              onChange={(e, key) => this.handleChange(e, "lastname")}
              value={this.state.lastname}
            />

            <label htmlFor="gender" className="label">
              <Translator string="gender" />
            </label>

            <div className="input-wrapper">
              <input
                onChange={(e, type) => this.handleChange(e, "gender")}
                type="radio"
                name="gender"
                value="m"
                checked={this.state.gender === "m"}
              />
              <span className="radio-label">
                <Translator string="male" />
              </span>
              <input
                onChange={(e, type) => this.handleChange(e, "gender")}
                type="radio"
                name="gender"
                value="f"
                checked={this.state.gender === "f"}
              />
              <span className="radio-label">
                <Translator string="female" />
              </span>
            </div>

            <label htmlFor="gender" className="label">
              <Translator string="birth" />
            </label>

            <div className="input-wrapper">
              <input
                className="form-input"
                id="register-day"
                type="text"
                onChange={(e, key) => this.handleChange(e, "day")}
                value={this.state.day}
              />

              <input
                className="form-input"
                id="register-month"
                type="text"
                onChange={(e, key) => this.handleChange(e, "month")}
                value={this.state.month}
              />

              <input
                className="form-input"
                id="register-year"
                type="text"
                onChange={(e, key) => this.handleChange(e, "year")}
                value={this.state.year}
              />
            </div>
          </div>
          <div className="column_2">
            <label htmlFor="email" className="label">
              <Translator string="email" />
            </label>

            <input
              id="email"
              className="form-input"
              type="email"
              value={this.state.email}
              onChange={(e, key) => this.handleChange(e, "email")}
            />

            <label htmlFor="lname" className="label">
              <Translator string="email" />
            </label>

            <input
              id="email_again"
              className="form-input"
              type="email"
              onChange={(e, key) => this.handleChange(e, "email_again")}
              value={this.state.email_again}
            />

            <label htmlFor="address" className="label">
              <Translator string="address" />
            </label>

            <input
              id="address"
              className="form-input"
              type="text"
              onChange={(e, key) => this.handleChange(e, "address")}
              value={this.state.address}
            />

            <label htmlFor="lname" className="label">
              <Translator string="city" />
            </label>

            <input
              id="city"
              className="form-input"
              type="text"
              onChange={(e, key) => this.handleChange(e, "city")}
              value={this.state.city}
            />

            <label htmlFor="country" className="label">
              <Translator string="country" />
            </label>

            <input
              id="country"
              className="form-input"
              type="text"
              onChange={(e, key) => this.handleChange(e, "country")}
              value={this.state.country}
            />

            <label htmlFor="user-type" className="label">
              <Translator string="userType" />
            </label>

            <input
              id="user-type"
              className="form-input"
              type="text"
              onChange={(e, key) => this.handleChange(e, "userType")}
              value={this.state.userType}
            />
          </div>
        </div>
        <div className="row_end">
          <div className="input-wrapper">
            <button onClick={this.register} className="form-button">
              <Translator string="register" />
            </button>

            <button
              onClick={() =>
                this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", "login")
              }
              className="form-button"
            >
              <Translator string="login" />
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
export default connect(null, mapDispatchToProps)(RegisterForm);
