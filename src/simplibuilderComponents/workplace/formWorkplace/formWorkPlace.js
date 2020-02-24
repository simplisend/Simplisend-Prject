import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";
import {
  AskAnswer,
  Heading,
  Information,
  Text,
  ShortText,
  DropDown,
  RadioCheck,
  Image,
  File,
  Signature,
  TextBlock
} from "../workplaceElements";
import { getRequest } from "../../../funcs/http";

/* map each button to the corresponding element */
const ELEMENTS_MAP = {
  askAnswer: AskAnswer,
  heading: Heading,
  info: Information,
  shortText: ShortText,
  textArea: Text,
  header: Text,
  dropList: DropDown,
  radioChoice: RadioCheck,
  checkBox: RadioCheck,
  image: Image,
  uploadFile: File,
  signature: Signature,
  textBlock: TextBlock
};

class FormWorkPlace extends Component {
  componentDidMount = () => {
    const { selectedForm, droppables } = this.props;
    if (
      selectedForm &&
      !selectedForm["isNew"] &&
      !droppables["formWorkplaceElements"]
    ) {
      getRequest(`forms/${selectedForm.slug}/`).then(resp => {
        getRequest(resp.data.elements, "").then(resp => {
          const data = JSON.parse(resp.data);
          this.props.updateData("SET_DETAILS", {
            type: "activeDetails",
            details: data.details
          });
          this.props.updateData("SET_DROPABLES", data.elements);
        });
      });
    }
  };

  /* when user opens a new form */
  componentDidUpdate = (prevProps, prevState) => {
    const { selectedForm } = this.props;
    if (
      selectedForm.slug &&
      prevProps.selectedForm &&
      prevProps.selectedForm.id &&
      prevProps.selectedForm.id !== selectedForm.id
    ) {
      this.props.updateData("SET_DROPABLES", {});
      this.props.updateData("SET_DETAILS", {
        type: "activeDetails",
        details: null
      });
      getRequest(`forms/${selectedForm.slug}/`)
        .then(resp => {
          getRequest(resp.data.elements, "").then(resp => {
            this.props.updateData("SET_DETAILS", {
              type: "activeDetails",
              details: resp.data.details
            });
            this.props.updateData(
              "SET_DROPABLES",
              JSON.parse(resp.data)["elements"]
            );
          });
        })
        .catch(e => {
          console.log("adsasdasdasd");
        });
    }
  };

  render = () => {
    const { droppables, currentActivePage } = this.props;

    let workplaceCls = "";
    let labelCls = "";
    let textCls = "";

    if (currentActivePage !== "formContainer") {
      workplaceCls = "unactive";
      labelCls = "unactive-Tag";
      textCls = "unactive-Container";
    }

    return (
      <div>
        {droppables &&
          droppables["formWorkplaceElements"] &&
          droppables["formWorkplaceElements"].map((item, i) => {
            if (item.blockType === "form") {
              const typ = /([a-zA-Z]+)\d+/.exec(item.droppable)[1];
              const Component = ELEMENTS_MAP[typ];

              return (
                <div id="wb_Container_holder" className={workplaceCls} key={i}>
                  <label htmlFor="titel" className={`containerTag ${labelCls}`}>
                    {"Title"}
                  </label>

                  <form className={`wp_Element_Container ${textCls}`}>
                    <Component
                      droppableId={item.droppable}
                      key={item.droppable}
                      ELEMENTS_MAP={ELEMENTS_MAP}
                    />
                  </form>
                </div>
              );
            }
            return null;
          })}
      </div>
    );
  };
}

const mapStoreToProps = state => {
  return {
    /* render workplace elements (heading,ask/answer,info ....)*/
    droppables: state.droppables.droppables,
    /* minpulate styles when this workplace is not active */
    currentActivePage: state.workplace.currentActivePage,
    activeForm: state.saForms.activeForm,
    selectedForm: state.activeItems.selectedForm
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* initiate the formContainer droppable */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(FormWorkPlace);
