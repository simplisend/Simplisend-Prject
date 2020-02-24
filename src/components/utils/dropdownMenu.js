import React, { Component } from "react";
import icons from "../../configs/icons";
import Svg from "../../configs/svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import messages from "../../configs/messages";

class DropdownMenu extends Component {
  handleClick = endpoint => {
    const { language } = this.props;
    const messageTitle = messages[language]["saveForm"]["title"];
    const messageText = messages[language]["saveForm"]["text"];
    this.props.updateData("SET_MESSAGE_DATA", {
      text: messageText,
      title: messageTitle
    });
    this.props.updateData("SHOW_ERROR", {
      key: "showFormSaveWarning",
      value: true
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "isSimpliBuilderNavButtonClicked",
      item: true
    });
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeNavLink",
      item: endpoint
    });
  };

  render = () => {
    const { isSimpliBuilderActive } = this.props;

    if (!isSimpliBuilderActive) {
      return (
        <div className="menue-nav">
          <ul className="warpper">
            <li className="dropped_wrapper">
              <ul className="dropped_list">
                <li id="title" className="list">
                  <span>Go Simpli</span>
                </li>

                <Link to="/">
                  <li className="list">
                    <span href="#" className="item">
                      <div id="simplisend">
                        <div id="logo_div">
                          <span className="simpli-logo">impli{Svg.logo}</span>
                          <span className="logo-domain">send</span>
                        </div>
                      </div>
                    </span>
                  </li>
                </Link>

                <Link to="/admin">
                  <li className="list">
                    <span href="#" className="item">
                      <div id="simpliadmin">
                        <div id="logo_div">
                          <span className="simpli-logo">impli{Svg.logo}</span>
                          <span className="logo-domain">admin</span>
                        </div>
                      </div>
                    </span>
                  </li>
                </Link>

                <Link to="/form-builder">
                  <li className="list">
                    <span href="#" className="item">
                      <div id="simplibuilder">
                        <div id="logo_div">
                          <span className="simpli-logo">impli{Svg.logo}</span>
                          <span className="logo-domain">builder</span>
                        </div>
                      </div>
                    </span>
                  </li>
                </Link>
              </ul>
            </li>
          </ul>
          <div className="dropLogo">
            <span className="dropMenue">{icons.dropMenu}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="menue-nav">
        <ul className="warpper">
          <li className="dropped_wrapper">
            <ul className="dropped_list">
              <li id="title" className="list">
                <span>Go Simpli</span>
              </li>

              <li className="list" onClick={() => this.handleClick("/")}>
                <span href="#" className="item">
                  <div id="simplisend">
                    <div id="logo_div">
                      <span className="simpli-logo">impli{Svg.logo}</span>
                      <span className="logo-domain">send</span>
                    </div>
                  </div>
                </span>
              </li>

              <li className="list" onClick={() => this.handleClick("/admin")}>
                <span href="#" className="item">
                  <div id="simpliadmin">
                    <div id="logo_div">
                      <span className="simpli-logo">impli{Svg.logo}</span>
                      <span className="logo-domain">admin</span>
                    </div>
                  </div>
                </span>
              </li>

              <li className="list">
                <span href="#" className="item">
                  <div id="simplibuilder">
                    <div id="logo_div">
                      <span className="simpli-logo">impli{Svg.logo}</span>
                      <span className="logo-domain">builder</span>
                    </div>
                  </div>
                </span>
              </li>
            </ul>
          </li>
        </ul>
        <div className="dropLogo">
          <span className="dropMenue">{icons.dropMenu}</span>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    isSimpliBuilderActive: state.activeItems.isSimpliBuilderActive,
    language: state.lang.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);
