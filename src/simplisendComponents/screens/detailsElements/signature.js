import React, { Component } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Translator } from "../../../components/utils";

class Signature extends Component {
  render = () => {
    return (
      <div className="block-container">
        <div>
          <SignatureCanvas
            penColor="black"
            ref={ref => {
              this.sigCanvas = ref;
            }}
          />
        </div>
        <div id="signature-btn" onClick={() => this.sigCanvas.clear()}>
          <Translator string="clear" />
        </div>
      </div>
    );
  };
}

export default Signature;
