import React, { Component } from "react";
import { PopUp, Translator } from "../../../components/utils";
import { updateData } from "../../../store/actions/rootActions";
import { connect } from "react-redux";

class BlockPopup extends Component {
  cancel = () => {
    const { droppables, activeElement } = this.props;
    const updatedDroppable = droppables[activeElement.droppableId].filter(
      item => item.type === "uploadSvg"
    );
    this.props.updateData("ADD_DROPPABLE", {
      key: activeElement.droppableId,
      column: updatedDroppable
    });
    this.props.updateData("SHOW_BLOCK", false);
    this.props.updateData("SET_POPUP_ACTIVE_ELEMENT", null);
  };

  render = () => {
    const { show } = this.props;
    return (
      <div className="sb-main-popup-wrapper">
        <PopUp show={show}>
          <div className="popup-header">
            <Translator string="choices" />
          </div>

          <div className="popup-body">
            <div>
              <label>
                <Translator string="shortText" />
                <input type="radio" name="choices" value="shortText" />
              </label>
            </div>

            <div>
              <label>
                <Translator string="textArea" />
                <input type="radio" name="choices" value="textArea" />
              </label>
            </div>

            <div>
              <label>
                <Translator string="signature" />
                <input type="radio" name="choices" value="signature" />
              </label>
            </div>

            <div>
              <label>
                <Translator string="image" />
                <input type="radio" name="choices" value="image" />
              </label>
            </div>

            <div>
              <label>
                <Translator string="number" />
                <input type="radio" name="choices" value="number" />
              </label>
            </div>

            <div>
              <label>
                <Translator string="date" />
                <input type="radio" name="choices" value="date" />
              </label>
            </div>
          </div>

          <div className="pop-up-bottons-wrapper">
            <button className="pop-up-button" onClick={this.cancel}>
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
    show: state.workplacePopups.block,

    /* which popup is now opened */
    activeElement: state.workplacePopups.activeElement,
    droppables: state.droppables.droppables
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
)(BlockPopup);
