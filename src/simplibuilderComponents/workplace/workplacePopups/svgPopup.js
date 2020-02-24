import React, { Component } from "react";
import { connect } from "react-redux";
import titles from "../../../configs/title";
import translator from "../../../funcs/translator";
import { Translator, PopUp } from "../../../components/utils";
import { updateData } from "../../../store/actions/rootActions";
import Select from "react-select";

class SvgPopup extends Component {
  state = {
    options: [
      { id: "a3", value: "a3", label: "A3 (420 * 297)mm" },
      { id: "a4", value: "a4", label: "A4 (297 * 210)mm" },
      { id: "a5", value: "a5", label: "A5 (210 * 148)mm" },
      { id: "a6", value: "a6", label: "A6 (148 * 105)mm" },
      { id: "a7", value: "a7", label: "A7 (105 * 74)mm" },
      { id: "a8", value: "a8", label: "A8 (74 * 52)mm" },
      { id: "a9", value: "a9", label: "A9 (52 * 37)mm" },
      { id: "a10", value: "a10", label: "A10 (37 * 26)mm" },
      { id: "custom", value: "custom", label: "custom" }
    ],
    // paddingVertical : 1 , // default vertical padding
    // paddingHorizontal : 1 , // default horizontal padding
    file: "",
    title: "",
    width: "",
    height: "",
    originalWidth: "",
    originalHeight: "",
    value: ""
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { activeElement, svg } = this.props;
    if (
      activeElement &&
      !svg[activeElement.id] &&
      activeElement.type === "uploadSvg"
    ) {
      this.props.updateData("SET_SVG", activeElement.id);
      return;
    }

    if (this.inputElement) {
      this.inputElement.click();
    }
  };

  // when user us typing a value for padding inupts
  handlePaddingChange = (e, key) => {
    const { value } = e.target;
    if (value > 0 && value <= 10) {
      this.setState({ [key]: Number(value) });
    }
  };

  handleChange = (e, key) => {
    if (
      Number(e.target.value) &&
      (Number(e.target.value) > 0 && Number(e.target.value) < 13)
    ) {
      this.setState({ [key]: e.target.value });
    }
  };

  submit = () => {
    const { activeElement } = this.props;
    const isValid = this.validate();

    if (isValid) {
      this.props.updateData("SET_SVG", {
        key: activeElement.id,
        url: this.state.file
      });
      this.props.updateData("SET_FORM_DETAILS", {
        key: activeElement.id,
        details: {
          key: activeElement.id,
          url: this.state.file,
          // paddingHorizontal : this.state.paddingHorizontal ,
          // paddingVertical : this.state.paddingVertical ,
          width: this.state.width ? this.state.width : 210,
          height: this.state.height ? this.state.height : 297,
          originalWidth: this.state.originalWidth,
          originalHeight: this.state.originalHeight,
          value: this.state.value
        },
        type: "activeDetails"
      });
      this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
      this.props.updateData("SHOW_UPLOADSVG", false);
      return;
    }

    this.props.updateData("SHOW_ERROR", {
      key: "showFormNamelessError",
      value: true
    });
  };

  cancel = () => {
    this.props.updateData("SHOW_UPLOADSVG", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  validate = () => {
    // const {title} = this.state;
    // const types = ['svg','SVG'] ;
    // const splited = title.split('.') ;
    // const ext = splited[splited.length - 1] ;
    // if (types.indexOf(ext) === -1 ) { return false }
    return true;
  };

  onChooseOption = choice => {
    const diminssionsTable = {
      a3: { height: 420, width: 297 },
      a4: { height: 297, width: 210 },
      a5: { height: 210, width: 148 },
      a6: { height: 148, width: 105 },
      a7: { height: 105, width: 74 },
      a8: { height: 74, width: 52 },
      a9: { height: 52, width: 37 },
      a10: { height: 37, width: 26 }
    };
    if (choice !== "custom") {
      const { width, height } = diminssionsTable[choice.value];
      this.setState({ width, height, value: choice });
      return;
    }
    this.setState({ value: choice });
  };

  onChooseFile = e => {
    const reader = new FileReader();

    const blobUrl = URL.createObjectURL(e.target.files[0]);
    const _title = e.target.value;

    reader.readAsDataURL(e.target.files[0]);
    reader.onload = e => {
      const img = new Image();
      img.src = blobUrl;

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        this.setState({
          file: e.target.result,
          title: _title,
          originalWidth: width,
          originalHeight: height
        });
      };
    };
  };

  render = () => {
    const { show, showFormNamelessError, language } = this.props;

    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={show}>
          <div className="popup-header">
            <Translator string="grid" />
          </div>

          <div className="popup-body">
            {showFormNamelessError && !this.state.isCustomized && (
              <span className="error"> * </span>
            )}

            <Select
              options={this.state.options}
              placeholder={translator("chooseDiminssions", titles[language])}
              onChange={this.onChooseOption}
              defaultValue={this.state.options[1]}
            />
          </div>

          <div className="sb-grid-rows-cols-container">
            <div className="sb-grid-axis-label">
              <input type="file" onChange={this.onChooseFile} />
            </div>
          </div>

          <div className="pop-up-bottons-wrapper">
            <button className="pop-up-button" onClick={this.submit}>
              <Translator string="ok" />
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
    /* whether to show this popup or not */
    show: state.workplacePopups.svg,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,

    /* show error message when validation is error upon submitting */
    showFormNamelessError: state.messages.showFormNamelessError,
    svg: state.workplaceElements.svg,
    activeDetails: state.formDetails.activeDetails,
    language: state.lang.lang
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
)(SvgPopup);
