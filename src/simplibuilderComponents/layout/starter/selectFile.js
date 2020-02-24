import React, { Component, Fragment } from "react";
import CatsList from "../../../simpliadminComponents/workplace/catsList";
import FormsList from "../../../simpliadminComponents/workplace/formsList";

import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import { Translator } from "../../../components/utils";

/* display the tree form user to choose from */
class SelectFile extends Component {


 componentDidUpdate = (prevProps,prevState) => {

  /*if user selects a form for the first time */
  if (this.props.activeForm && !prevProps.activeForm) {
    this.props.updateData('SET_ACTIVE_ITEM', {
      key : "selectedForm" ,
      item : {...this.props.selectedForm , title : this.props.activeForm.title}
    }) ;
    return
  }

  /* if user already selected form and then selected another one */
  if (this.props.activeForm && prevProps.activeForm && this.props.activeForm.id !== prevProps.activeForm.id) {
    this.props.updateData('SET_ACTIVE_ITEM', {
      key : "selectedForm" ,
      item : {...this.props.selectedForm , title : this.props.activeForm.title}
    }) ;
  }

 }

 /* change form name */
  handleChange = e => {
    const { selectedForm } = this.props;
    const updatedSelectedForm = { ...selectedForm, title: e.target.value };
    this.props.updateData("SET_ACTIVE_ITEM", {
      key : 'selectedForm' ,
      item : updatedSelectedForm ,
    });
  };

  render = () => {
    const { selectedForm, showFormNamelessError } = this.props;
    return (
      <Fragment>
        <div className="popup-body">
          <div className="tree_container">
            <div className="sa-body-col">
              <div className="sa-cats">
                <CatsList />
              </div>
            </div>
            <div className="sa-body-col-2">
              <div className="sa-forms">
                <FormsList />
              </div>
            </div>
          </div>
        </div>
        <div className="popup-body">
          <input
            className="input-field"
            type="text"
            onChange={this.handleChange}
            value={ selectedForm.title }
          />
          {showFormNamelessError && (
            <p className="error">
              <Translator string="requiredField" />
            </p>
          )}
        </div>
      </Fragment>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* current opend form in sumpilBuilder */
    selectedForm: state.activeItems.selectedForm,

    /* when user submits form save without filling the title input */
    showFormNamelessError: state.messages.showFormNamelessError,

    /* if user selected a form then set it's title as title for current opened form */
    activeForm : state.saForms.activeForm ,

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
)(SelectFile);
