import React, { Component } from "react";
import CatsList from "./catsList";
import CatProps from "./catProps";
import FormsList from "./formsList";
import FormProps from "./formProps";
import TranslationList from "./translationList";
import { updateData } from "../../store/actions/rootActions";
import { connect } from "react-redux";

class CategroriesTree extends Component {
  render = () => {
    const { translatorIsOpened } = this.props;
    return (
      <div className="admin-body-wrapper">
        <div className="sa-row sa-top-row">
          <div className="sa-cats">
            <CatsList />
          </div>

          <div className="sa-forms">
            <FormsList />
          </div>
        </div>

        {translatorIsOpened && (
          <div className="sa-row">
            <TranslationList {...this.props} />
          </div>
        )}

        {!translatorIsOpened && (
          <div className="sa-row sa-bottom-row">
            <div className="sa-cats-props">
              <CatProps />
            </div>

            <div className="sa-forms-props">
              <FormProps {...this.props} />
            </div>
          </div>
        )}
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    translatorIsOpened: state.saLeftSidebar.translatorIsOpened
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CategroriesTree);
