import React from "react";
import { updateData } from "../../../store/actions/rootActions";
import { connect } from "react-redux";

const Footer = ({ updateData }) => {
  return <div id="sb-footer"></div>;
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};
export default connect(
  null,
  mapDispatchToProps
)(Footer);
