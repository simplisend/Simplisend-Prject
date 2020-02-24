import React, { Component } from "react";
import { connect } from "react-redux";
import { Translator, PopUp } from "../../../components/utils";
import Select from "react-select";
import { updateData } from "../../../store/actions/rootActions";
import { getRequest } from "../../../funcs/http";

class SelecteLanguage extends Component {
  state = { options: null, selectedLang: null };

  componentDidMount = () => {
    getRequest("langs").then(resp => {
      if (resp.status === 200) {
        const options = resp.data.map(item => {
          return { label: item.symbol, value: item.id, id: item.id };
        });
        this.setState({ options });
      }
    });
  };

  handleChange = selectedOption => {
    this.setState({ selectedLang: selectedOption });
  };

  select = () => {
    const { selectedForm } = this.props;
    const { selectedLang } = this.state;
    if (selectedLang) {
      const updatedSelectedForm = {
        ...selectedForm,
        default_lang: selectedLang
      };
      this.props.updateData("SET_ACTIVE_ITEM", {
        key: "selectedForm",
        item: updatedSelectedForm
      });
      this.props.updateData("SHOW_SELECTE_LANG", false);
    }
  };

  render = () => {
    const { showSelectLang } = this.props;

    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={showSelectLang}>
          <div className="popup-header">
            <Translator string="selectLang" />
          </div>
          <div className="popup-body">
            {this.state.options && (
              <Select
                options={this.state.options}
                onChange={this.handleChange}
              />
            )}
          </div>

          <div className="pop-up-bottons-wrapper">
            <button className="pop-up-button" onClick={this.select}>
              <Translator string="select" />
            </button>
          </div>
        </PopUp>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* current opend form in sumpilBuilder */
    selectedForm: state.activeItems.selectedForm,

    /* when user submits form save without filling the title input */
    showSelectLang: state.starter.showSelectLang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelecteLanguage);
