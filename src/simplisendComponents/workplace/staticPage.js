import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";

import englishAboutUs from "../../staticPages/aboutUs/en/aboutUs";
import arabicAboutUs from "../../staticPages/aboutUs/ar/aboutUs";
import germanAboutUs from "../../staticPages/aboutUs/gr/aboutUs";

import englishTerms from "../../staticPages/terms/en/terms";
import arabicTerms from "../../staticPages/terms/ar/terms";
import germanTerms from "../../staticPages/terms/gr/terms";

import englishPrivacy from "../../staticPages/privacy/en/privacy";
import arabicPrivacy from "../../staticPages/privacy/ar/privacy";
import germanPrivacy from "../../staticPages/privacy/gr/privacy";

import englishContacts from "../../staticPages/contacts/en/contacts";
import arabicContacts from "../../staticPages/contacts/ar/contacts";
import germanContacts from "../../staticPages/contacts/gr/contacts";

import englishPartner from "../../staticPages/partner/en/partner";
import arabicPartnet from "../../staticPages/partner/ar/partner";
import germanPartner from "../../staticPages/partner/gr/partner";

const mapLangToPageContent = {
  aboutUs: {
    en: englishAboutUs.content,
    ar: arabicAboutUs.content,
    gr: germanAboutUs.content
  },
  terms: {
    en: englishTerms.content,
    ar: arabicTerms.content,
    gr: germanTerms.content
  },
  privacy: {
    en: englishPrivacy.content,
    ar: arabicPrivacy.content,
    gr: germanPrivacy.content
  },
  contacts: {
    en: englishContacts.content,
    ar: arabicContacts.content,
    gr: germanContacts.content
  },
  partner: {
    en: englishPartner.content,
    ar: arabicPartnet.content,
    gr: germanPartner.content
  }
};

class StaticPage extends Component {
  removeStaticPage = () => {
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeStaticPage",
      item: null
    });
  };

  render = () => {
    const { language, activeStaticPage } = this.props;
    let content;
    if (activeStaticPage) {
      content = mapLangToPageContent[activeStaticPage][language];
    }

    return (
      <div className="static-page-container">
        <div className="static-page">
          <div className="btn-close" onClick={this.removeStaticPage}>
            X
          </div>
          {content && <div className="text-contenet">{content}</div>}
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    language: state.lang.lang,
    activeStaticPage: state.activeItems.activeStaticPage
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
)(StaticPage);
