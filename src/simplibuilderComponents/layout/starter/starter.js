import React from "react";
import icons from "../../../configs/icons";
import { Translator } from "../../../components/utils";

/* a screen that will pop up to ask the user whether he wants to open an existing form or create new one */
const StarterScreen = ({ handleOpen, handleNew }) => {
  return (
    <div id="new_open">
      <button id="starter-btn-New" onClick={() => handleNew()}>
        {icons.new}
        <span id="starter-btn-NewText">
          <Translator string="new" />
        </span>
      </button>

      <button id="starter-btn-Open" onClick={() => handleOpen()}>
        {icons.open}
        <span id="starter-btn-OpenText">
          <Translator string="open" />
        </span>
      </button>
    </div>
  );
};

export default StarterScreen;
