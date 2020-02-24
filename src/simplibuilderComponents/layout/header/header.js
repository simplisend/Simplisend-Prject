import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import HeaderButton from "./headerButton";
import Svg from "./../../../configs/svg";
import {
  Translator,
  SelectLanguage,
  DropdownMenu
} from "../../../components/utils";

class Header extends Component {
  /* change which button is active */
  handleClick = e => {
    const name = e.target.name;
    this.props.updateData("ACTIVE", name);
  };

  render = () => {
    const domainTitle = this.props.domainTitle
      ? this.props.domainTitle
      : "builder";
    return (
      <div id="headerContainer">
        <div id="sb_logo-header">
          <div id="logo_div">
            <span className="simpli-logo">impli{Svg.logo}</span>
            <span className="logo-domain">{domainTitle}</span>
          </div>
        </div>
        <div id="sb_tag-Container">
          <div id="tagGroup">
            <HeaderButton
              name="form"
              title={<Translator string="form" />}
              id="btn-TagForm"
              zIndex={3}
              action={this.handleClick}
            />
            <HeaderButton
              name="element"
              title={<Translator string="element" />}
              id="btn-TagElement"
              zIndex={2}
              action={this.handleClick}
            />
            <HeaderButton
              name="style"
              title={<Translator string="style" />}
              id="btn-TagStyle"
              zIndex={1}
              action={this.handleClick}
            />
          </div>
        </div>
        <DropdownMenu />

        <SelectLanguage />
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    /* update which header button is active */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(null, mapDispatchToProps)(Header);
