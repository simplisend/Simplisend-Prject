import React, { Fragment } from "react";
import { connect } from "react-redux";

const HeaderButton = ({
  id,
  zIndex,
  action,
  title,
  active,
  name,
  index,
  closeTab
}) => {
  const left = -((index + 1) * 10);

  let zIndx = zIndex;
  let cls = "ss_tag";

  if (name === active) {
    zIndx = 100;
    cls = "ss_tag active";
  }

  /* when using this button in simplisend i don't want the starter screen logic to be applied to it */

  return (
    <Fragment>
      <button
        id={id}
        style={{ zIndex: zIndx, left }}
        onClick={action}
        className={cls}
        name={name}
      >
        {title}
      </button>
      {name !== "1" && (
        <span
          style={{ left: -((index + 1) * 10) - 20 }}
          className="closeBtn"
          onClick={() => closeTab(index)}
        >
          x
        </span>
      )}
    </Fragment>
  );
};

//<Translator string = {title} />
const mapStoreToProps = state => {
  return {
    active: state.ssheader.active
  };
};

export default connect(mapStoreToProps)(HeaderButton);
