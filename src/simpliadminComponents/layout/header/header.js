import React, { Component } from "react";
import HeaderButton from "./headerButton";
import Svg from "./../../../configs/svg";
import { SelectLanguage, DropdownMenu } from "../../../components/utils";
import { Translator } from "../../../components/utils";
class Header extends Component {
  render = () => {
    const { domainTitle } = this.props;

    return (
      <div id="headerContainer">
        <div id="ss_logo-header">
          <div id="logo_div">
            <span className="simpli-logo">impli{Svg.logo}</span>
            <span className="logo-domain">{domainTitle}</span>
          </div>
        </div>

        <div id="ss_tag-Container">
          <div id="tagGroup">
            <button className="sa_tag active">
              <Translator string="home" />
            </button>
          </div>
        </div>

        <DropdownMenu />
        <SelectLanguage />
      </div>
    );
  };
}

export default Header;
