import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import { Translator, PopUp } from "../../../components/utils";

import CatsList from "../../../simpliadminComponents/workplace/catsList";
import FormsList from "../../../simpliadminComponents/workplace/formsList";

class SelectForm extends Component {

  select = () => {

    const { activeForm,selectedForm,activeWorkplacePage } = this.props;

    if (activeForm) {
      /* change dropdown menu */
      this.props.updateData("SET_ACTIVE_ITEM",{key : 'isSimpliBuilderActive', item : true })

      this.props.updateData('SET_ACTIVE_ITEM',{
        key : 'selectedForm' ,
        item : {...activeForm,originalTitle : activeForm.title }
      })

      /*set title for side bar */
      this.props.updateData("SIDEBAR_TITLE","container");
      /* set sidebar buttons */
      this.props.updateData("SIDEBAR_BLOCK","form");

      /* active buttons in toolbar*/
      this.props.updateData("UPDATE_SELECTED", ["btn-Form_Nav"]);

      if (!activeWorkplacePage || (activeWorkplacePage &&  activeWorkplacePage !== 'formContainer') ) {
        /* when user opens new form from toolbar  */
        if (selectedForm) {
          this.props.updateData("RESET_PAGES");
        } else {
            /* when user opens a new form from starter screen */
          this.props.updateData('PAGE','btn-Form_Nav')
        }

      }

      /* display workplace page */
      this.props.updateData("SHOW_BUTTONS", true); /* show header buttons */
      /* set active tree node to be the catrgory of this form*/
      this.props.updateData("SET_ACTIVE_TREE_NODE",activeForm.category);
      this.props.updateData("TOGGLE_STARTER_SCREEN", false);
      this.props.updateData("SHOW_SELECT_SCREEN", false);
    }
  };

  cancel = () => {
    this.props.updateData("SHOW_SELECT_SCREEN", false);
  }

  render = () => {
    const { showSelectFormScreen } = this.props;
    return (
      <div className="sb-starter-popup-wrapper">
        <PopUp show={showSelectFormScreen}>
          <div className="popup-header">
            <Translator string="selectFormHeading" />
          </div>
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

          <div className="pop-up-bottons-wrapper">
            <button className="pop-up-button" onClick={this.select}>
              <Translator string="select" />
            </button>
            <button className="pop-up-button" onClick={this.cancel}>
              <Translator string="cancel" />
            </button>
          </div>
        </PopUp>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    activeForm: state.saForms.activeForm,
    selectedForm : state.activeItems.selectedForm,
    showSelectFormScreen: state.starter.showSelectFormScreen,
    activeWorkplacePage : state.workplace.currentActivePage,
      droppables: state.droppables.droppables,
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
)(SelectForm);
