import React, { Component } from "react";
import HeaderButton from "./headerButton";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import Svg from "./../../../configs/svg";
import icons from "./../../../configs/icons";

import {
  SelectLanguage,
  DropdownMenu,
  Translator
} from "../../../components/utils";

class Header extends Component {
  /* change which button is active in the header */
  handleClick = e => {
    const name = e.target.name;
    this.props.updateData("SS_HEADER_ACTIVE", name);
  };

  /* dipslay the pop-up*/
  showModal = () => {
    this.props.updateData("SS_SHOW_MODAL", true);
  };

  render = () => {
    const { domainTitle, selectedButtons } = this.props;

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
            <HeaderButton
              name="1"
              title={<Translator string="home" />}
              zIndex={selectedButtons.length + 1}
              action={this.handleClick}
              index={-1}
            />

            {selectedButtons.map((buttonTitle, i) => {
              return (
                <HeaderButton
                  name={buttonTitle}
                  title={buttonTitle.split(";")[1]}
                  zIndex={selectedButtons.length - i}
                  action={this.handleClick}
                  index={i}
                  key={buttonTitle}
                  closeTab={this.props.closeTab}
                />
              );
            })}

            <button
              style={{ left: -(selectedButtons.length * 10) }}
              onClick={this.showModal}
              id="ss-header-add-button"
            >
              {icons.add}
            </button>
          </div>
        </div>

        <DropdownMenu />
        <SelectLanguage />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* loop through this and render buttons */
    selectedButtons: state.ssheader.selectedButtons
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* change the active button in header and updated the selected buttons */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
