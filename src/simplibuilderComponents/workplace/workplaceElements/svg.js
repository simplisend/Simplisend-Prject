import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../../store/actions/rootActions";

import Draggable from "react-draggable";

class Svg extends Component {
  state = { containerWidth: null, element: null };

  componentDidMount = () => {
    if (this.container) {
      this.setState({ element: this.container });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (!prevState.element && this.state.element) {
      this.setState({ containerWidth: this.container.clientWidth });
    }
  };

  render = () => {
    const { activeDetails, id } = this.props;
    const data = activeDetails[id];
    const value = data.value;
    const ratio =
      value === "custom" ? data.originalHeight / data.originalWidth : 1.4;

    const { containerWidth } = this.state;

    return (
      <div className="svg-container">
        <div
          className="svg-image-container"
          ref={element => (this.container = element)}
        >
          {this.state.containerWidth && (
            <img className="svg" src={`${data.url}`} alt="svg-img" />
          )}

          <div className="svg-drag-field">
            <Draggable
              axis="both"
              defaultPosition={{ x: 0, y: 0 }}
              position={null}
              bounds={{
                top: 0,
                left: 0,
                right: containerWidth - 75,
                bottom: containerWidth * ratio - 75
              }}
            >
              <div>
                <div
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    background: "#444"
                  }}
                ></div>
              </div>
            </Draggable>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    activeDetails: state.formDetails.activeDetails
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
)(Svg);
