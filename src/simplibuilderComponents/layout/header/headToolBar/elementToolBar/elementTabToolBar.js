import React, { Component } from "react";
import ElementTabButton from "./elementTabButton";
import ContentHolder from "../contentHolder";
import icons from "../../../../../configs/icons";
import { connect } from "react-redux";
import { updateData } from "../../../../../store/actions/rootActions";
import { Translator } from "../../../../../components/utils";
import { FormTabButton } from "../formToolBar";

/* tool bar for Element tab in the header */
class ElementTabToolBar extends Component {
  changeActive = e => {
    this.props.updateData("UPDATE_FORM_TOOL_BAR_ACTIVE", e.target.id);
  };

  render = () => {
    return (
      <div>
        <ContentHolder id="elementToolGroup">
          <ElementTabButton
            id="btn-Container"
            title="container"
            symbol={icons.container}
          />
          <ElementTabButton
            id="btn-Element"
            title="element"
            symbol={icons.element}
          />
          <ElementTabButton
            id="btn-Library"
            title="library"
            symbol={icons.library}
          />
          <ElementTabButton
            id="btn-Property"
            title="property"
            symbol={icons.property}
          />
          <ElementTabButton
            id="btn-Condition"
            title="condition"
            symbol={icons.condition}
          />
        </ContentHolder>

        <ContentHolder id="propertyToolGroup" />

        <ContentHolder
          id="select_edit_group"
          title={<Translator string="select_edit" />}
        >
          <FormTabButton
            type="activeButton"
            id="btn-Select-element-bar"
            cls="symbol-btn-Borderd"
            symbol={icons.select}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Move"
            cls="symbol-btn-Borderd"
            symbol={icons.move}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Divide"
            cls="symbol-btn-Borderd"
            symbol={icons.divide}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-SaveElement"
            cls="symbol-btn-Borderd"
            symbol={icons.save}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Duplicate"
            cls="symbol-btn-Borderd"
            symbol={icons.duplicate}
            action={this.changeActive}
          />
          <FormTabButton
            type="activeButton"
            id="btn-Delete"
            cls="symbol-btn-Borderd"
            symbol={icons.delete}
            action={this.changeActive}
          />
        </ContentHolder>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(null, mapDispatchToProps)(ElementTabToolBar);
