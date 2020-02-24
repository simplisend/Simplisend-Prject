import React, { Component } from "react";
import { Header, Footer, BodyWrapper } from "../layout";
import { PopUp } from "../../components/utils";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { getRequest } from "../../funcs/http";
import StaticPage from "../workplace/staticPage";
import { base } from "../../configs/constants";
import Translator from "../../components/utils/translator";
import Svg from "../../configs/svg";

class Simplisend extends Component {
  state = { selectedButtons: [], password: "" };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    return { selectedButtons: nextProps.selectedButtons };
  };

  setPrivatePassword = () => {
    const { password } = this.state;
    if (password) {
      this.props.updateData("SET_PRIVATE_PASSWORD", password);
    }
  };
  changeLanguage = langKey => {
    localStorage.setItem("lang", langKey);
    this.props.updateData("LANG", langKey);
  };

  componentDidMount = () => {
    const { tags, lastOpenedForm } = this.props;

    const url = window.location.href;

    if (url !== base && lastOpenedForm) {
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "activeFormDetails",
        item: lastOpenedForm
      });
    }
    this.props.updateData("SIDEBAR_TITLE", "");

    if (!tags.length) {
      getRequest("tree/tags").then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_TAGS", resp.data);
          resp.data.map(item => {
            this.props.updateData("SET_FORM_STYLE", {
              id: item.id,
              style: item.style
                ? JSON.parse(item.style)
                : { backgroundColor: "black" }
            });
            return null;
          });
        }
      });
    }
  };

  onSubmit = () => {
    const { activeHeaderButton } = this.props;
    const index = this.state.selectedButtons.indexOf(activeHeaderButton);
    /* if user removed the current active button then set home button as the active one*/
    if (index === -1) {
      this.props.updateData("SS_HEADER_ACTIVE", "1");
    }

    this.props.updateData("SS_SELECTE_BUTTON", this.state.selectedButtons);
    this.props.updateData("SS_SHOW_MODAL", false);
    this.props.updateData("SS_SHOW_LANG-CHOISE", false);
  };

  onCancel = () => {
    this.props.updateData("SS_SHOW_MODAL", false);
    this.props.updateData("SS_SHOW_LANG-CHOISE", false);
  };

  handleSelectButton = (e, type) => {
    const { selectedButtons } = this.state;
    const index = selectedButtons.indexOf(type);
    if (index === -1) {
      selectedButtons.push(type);
    } else {
      selectedButtons.splice(index, 1);
    }
    console.log(selectedButtons);
    this.setState({ selectedButtons });
  };

  closeTab = index => {
    const { selectedButtons } = this.props;

    const updatedSelectedButton = [...selectedButtons];
    updatedSelectedButton.splice(index, 1);
    this.props.updateData("SS_SELECTE_BUTTON", updatedSelectedButton);
    this.props.updateData("SS_HEADER_ACTIVE", "1");
  };

  render = () => {
    const {
      showModal,
      showLangChoice,
      tags,
      activeStaticPage,
      isLayoutClassChanged
    } = this.props;

    return (
      <div className={isLayoutClassChanged ? "ss-layout-0" : "ss-layout-1"}>
        <BodyWrapper {...this.props} />
        {activeStaticPage && <StaticPage />}
        <Header domainTitle={"send"} closeTab={this.closeTab} />
        <Footer />

        <div className="ss-main-popup-wrapper">
          <PopUp show={showModal}>
            {/* pop-up body wrapper  */}

            {tags.map((item, i) => {
              /*
                  to solve the id,title problem
                  filters (filters in simplisend right sidebar) are lestening to ids
                  so if i clikced on a tag in the header it's id will be Save
                  thus it's id will show as a title in the header
                  so i sent both the id and the title and each part takes what it needs
                */
              const typ = item.id + ";" + item.title;

              return (
                <div
                  className={
                    this.state.selectedButtons.indexOf(typ) !== -1
                      ? "popup-tag-link active"
                      : "popup-tag-link"
                  }
                  onClick={(e, type) => this.handleSelectButton(e, typ)}
                  key={i}
                >
                  <div id="logo_div">
                    <span className="simpli-logo-2">
                      {item.title}
                      {Svg.logo}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* pop-up buttons */}
            <div className="pop-up-bottons-wrapper">
              <div id="logo_div">
                <span className="simpli-logo">impli{Svg.logo}</span>
              </div>
              <input
                id="password"
                name="private-form-password"
                type="password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
              />
              <button
                className="pop-up-button"
                onClick={this.setPrivatePassword}
              >
                <Translator string="add" />
              </button>

              <button className="pop-up-button" onClick={this.onCancel}>
                <Translator string="cancel" />
              </button>
              <button className="pop-up-button" onClick={this.onSubmit}>
                <Translator string="ok" />
              </button>
            </div>
            {/* end of pop-up buttons */}

            {/* end of pop-up body wrapper  */}
          </PopUp>
        </div>

        <div className="ss-main-popup-wrapper">
          <PopUp show={showLangChoice}>
            <div className="popup-header">Select Lnaguage</div>
            {/* pop-up body wrapper  */}
            <div className="popup-body">
              <div
                className="langList"
                onClick={() => this.changeLanguage("ar")}
              >
                Arabic
              </div>
              <div
                className="langList"
                onClick={() => this.changeLanguage("gr")}
              >
                Deutsch
              </div>
              <div
                className="langList"
                onClick={() => this.changeLanguage("en")}
              >
                Englisch
              </div>
            </div>
            {/* pop-up buttons */}
            <div className="pop-up-bottons-wrapper">
              <button className="pop-up-button" onClick={this.onSubmit}>
                <Translator string="chooseLanguage" />
              </button>
            </div>
            {/* end of pop-up buttons */}

            {/* end of pop-up body wrapper  */}
          </PopUp>
        </div>
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

const mapStateToProps = state => {
  return {
    /* show the popup */
    showModal: state.ssheader.showModal,
    showLangChoice: state.ssheader.showLangChoice,
    /* display header buttons dynamically */
    selectedButtons: state.ssheader.selectedButtons,
    /* change logo domain */
    activeHeaderButton: state.ssheader.active,

    /* buttons to render in popup*/
    tags: state.saCatsReducer.tags,
    activeStaticPage: state.activeItems.activeStaticPage,
    isLayoutClassChanged: state.ssClassToggler.isChanged,
    lastOpenedForm: state.tempData.lastOpenedForm
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Simplisend);
