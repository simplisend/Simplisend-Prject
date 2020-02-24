import React from "react";
import { Translator } from "../../components/utils";
import { updateData } from "../../store/actions/rootActions";
import { connect } from "react-redux";

const Footer = ({ updateData }) => {
  return (
    <div id="ss-footer">
      <div id="ss-footer-links-wrapper">
        <div
          className="ss-footer-link-item"
          onClick={() =>
            updateData("SET_ACTIVE_ITEM", {
              key: "activeStaticPage",
              item: "aboutUs"
            })
          }
        >
          <Translator string="about_us" />
        </div>
        <div
          className="ss-footer-link-item"
          onClick={() =>
            updateData("SET_ACTIVE_ITEM", {
              key: "activeStaticPage",
              item: "contacts"
            })
          }
        >
          <Translator string="contacts" />
        </div>

        <div
          className="ss-footer-link-item"
          onClick={() =>
            updateData("SET_ACTIVE_ITEM", {
              key: "activeStaticPage",
              item: "partner"
            })
          }
        >
          <Translator string="partner" />
        </div>
        <div
          className="ss-footer-link-item"
          onClick={() =>
            updateData("SET_ACTIVE_ITEM", {
              key: "activeStaticPage",
              item: "privacy"
            })
          }
        >
          <Translator string="privacy" />
        </div>
        <div
          className="ss-footer-link-item"
          onClick={() =>
            updateData("SET_ACTIVE_ITEM", {
              key: "activeStaticPage",
              item: "terms"
            })
          }
        >
          <Translator string="terms" />
        </div>
      </div>
    </div>
  );
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
