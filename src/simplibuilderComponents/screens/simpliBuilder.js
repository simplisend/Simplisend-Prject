import React, { Fragment, Component } from "react";
import { Header, Footer, BodyWrapper } from "../layout";
import {
  ShortTextPopup,
  DropDownPopup,
  DropDownItemsBlockPopup,
  RadioCheckPopup,
  ImagePopup,
  FilePopup,
  GridPopup,
  SvgPopup,
  BlockPopup,
  TextBlockPopup
} from "../workplace/workplacePopups";
import { connect } from "react-redux";

class SimpliBuilder extends Component {
  render = () => {
    return (
      <Fragment>
        <BodyWrapper {...this.props} />
        <Header />
        <Footer />
        <ShortTextPopup />
        <DropDownPopup />
        <DropDownItemsBlockPopup />
        <RadioCheckPopup />
        <ImagePopup />
        <FilePopup />
        <GridPopup />
        <SvgPopup />
        <BlockPopup />
        <TextBlockPopup />
      </Fragment>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* show the popup */
    activeStaticPage: state.activeItems.activeStaticPage
  };
};

export default connect(mapStateToProps)(SimpliBuilder);
