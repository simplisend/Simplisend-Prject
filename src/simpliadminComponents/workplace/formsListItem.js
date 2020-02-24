import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import { Translator } from "../../components/utils";
import { getRequest } from "../../funcs/http";
import FormItem from "./formItem";

class FormsListItem extends Component {
  componentDidMount = () => {
    const { forms, activeTreeNode, activeFormsListTag } = this.props;
    const k =
      activeTreeNode && activeTreeNode.slug === "root"
        ? "master"
        : `${activeFormsListTag}_${activeTreeNode.id}`;

    if (!forms[k]) {
      getRequest(
        `forms?cat=${activeTreeNode.id}&type=${activeFormsListTag}`
      ).then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_FORMS", { key: k, forms: resp.data });
        }
      });
    }
  };

  /* when changing active tree node or changing activeFormsListTag */
  componentDidUpdate = (prevProps, prevState) => {
    const { forms, activeTreeNode, activeFormsListTag } = this.props;
    const k =
      activeTreeNode && activeTreeNode.slug === "root"
        ? "master"
        : `${activeFormsListTag}_${activeTreeNode.id}`;

    if (!forms[k]) {
      getRequest(
        `forms?cat=${activeTreeNode.id}&type=${activeFormsListTag}`
      ).then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_FORMS", { key: k, forms: resp.data });
        }
      });
    }
  };

  setActiveFormListItemTag = value => {
    this.props.updateData("SET_ACTIVE_ITEM", {
      key: "activeFormsListTag",
      item: value
    });
  };

  render = () => {
    const { forms, activeTreeNode, activeFormsListTag } = this.props;

    let type;

    if (activeTreeNode && activeTreeNode.slug === "root") {
      type = "master";
    } else {
      type = `${activeFormsListTag}_${activeTreeNode.id}`;
    }

    return (
      <div>
        <div>
          {activeTreeNode.slug === "root" && (
            <button className="builderTag active_1">
              <Translator string="master" />
            </button>
          )}

          {activeTreeNode.slug !== "root" && (
            <Fragment>
              <button
                onClick={() => this.setActiveFormListItemTag("form")}
                className={
                  activeFormsListTag === "form"
                    ? "builderTag active_1"
                    : "builderTag"
                }
              >
                <Translator string="forms" />
              </button>
              <button
                onClick={() => this.setActiveFormListItemTag("sub-form")}
                className={
                  activeFormsListTag === "sub-form"
                    ? "builderTag active_1"
                    : "builderTag"
                }
              >
                <Translator string="subForms" />
              </button>
            </Fragment>
          )}
        </div>

        <div className="wpContainer">
          <div className="forms-container">
            {forms[type] &&
              forms[type].map(item => {
                return <FormItem item={item} key={item.id} />;
              })}

            {forms[type] && forms[type].length === 0 && (
              <h3>
                <Translator string="noData" />
              </h3>
            )}
          </div>
        </div>
      </div>
    );
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    /* render forms */
    forms: state.saForms.forms,

    /* control which buttons should appear based on current active tree item */
    activeTreeNode: state.saCatsReducer.activeTreeNode,
    activeFormsListTag: state.activeItems.activeFormsListTag
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormsListItem);
