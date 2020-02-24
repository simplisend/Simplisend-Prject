import React from "react";
import { Translator } from "../../components/utils";

const WorkPlaceButton = ({ cls, id, action, left, right, position, name }) => {

  return (
    <button
      onClick={action}
      id={id}
      className={cls}
      style={{ display: "inline-block", left, right, position }}
      name={name}
    >
      <Translator string={name} />
    </button>
  );
};

export default WorkPlaceButton;
