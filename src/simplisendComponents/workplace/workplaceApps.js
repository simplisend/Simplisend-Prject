import React, { Component } from "react";
import WorkplaceApp from "./workplaceApp";
import { updateData } from "../../store/actions/rootActions";
import { connect } from "react-redux";
import { getRequest } from "../../funcs/http";
import { server } from "../../configs/constants";

/* container that wrapps apps in workplace page */
class WorkplaceApps extends Component {
  componentDidMount = () => {
    const { forms, tags } = this.props;

    if (!forms["all"]) {
      getRequest(`forms/all`).then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_FORMS", { key: "all", forms: resp.data });
        }
      });
    }

    if (!tags.length) {
      getRequest("tree/tags").then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_TAGS", resp.data);
        }
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { forms, privatePassword } = this.props;

    if (privatePassword !== prevProps.privatePassword) {
      this.getPrivateTags(privatePassword);
    }

    const id = this.props.activeHeaderTag.split(";")[0];
    if (
      prevProps.activeHeaderTag !== this.props.activeHeaderTag &&
      !forms[id] &&
      id !== "1"
    ) {
      const _id = this.props.activeHeaderTag.split(";")[0];
      this.props.gottenPrivateTags.indexOf(_id);
      const url =
        this.props.gottenPrivateTags.indexOf(Number(_id)) === -1
          ? `forms/?cat=${id}&type=form&no_auth=1`
          : `forms/?cat=${id}&type=form&no_auth=1&private=1`;

      getRequest(url).then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_FORMS", { key: id, forms: resp.data });
        }
      });
    }
  };

  RemoveRightSideBarElement = () => () =>
    this.props.updateData("SET_RIGHT_SIDEBAR_ELEMENT", null);

  // when user clicks on a tag in simplisend add it if not exist already
  openTag = item => {
    const { selectedButtons } = this.props;
    const type = `${item.id};${item.title}`;
    if (selectedButtons.indexOf(type) === -1) {
      const updatedSelectedButtons = [...selectedButtons, type];
      this.props.updateData("SS_SELECTE_BUTTON", updatedSelectedButtons);
      this.props.updateData("SS_HEADER_ACTIVE", type);
    }
  };

  getPrivateTags = password => {
    const { tags, gottenPrivatePasswords, selectedButtons } = this.props;
    if (gottenPrivatePasswords.indexOf(password) === -1) {
      getRequest(`tree/get_private_tags/${password}`).then(resp => {
        const updatedTags = [...tags, ...resp.data];
        const _newSelected = resp.data.map(item => {
          return `${item.id};${item.title}`;
        });

        const updatedSelectedButtons = [...selectedButtons, ..._newSelected];

        this.props.updateData("SET_TAGS", updatedTags);
        this.props.updateData("SS_SHOW_MODAL", false);
        this.props.updateData("SS_SHOW_LANG-CHOISE", false);

        updatedTags.forEach(tag => {
          const style = JSON.parse(tag.style);
          this.props.updateData("SET_FORM_STYLE", { id: tag.id, style });
        });
        this.props.updateData("ADD_GOTTEN_PRIVATE_PASSWORD", password);
        const ids = resp.data.map(item => item.id);
        this.props.updateData("ADD_GOTTEN_PRIVATE_TAGS", ids);
        this.props.updateData("SS_SELECTE_BUTTON", updatedSelectedButtons);
      });
    }
  };

  render = () => {
    const { forms, activeHeaderTag, tags, formStyle } = this.props;
    const id = activeHeaderTag.split(";")[0];
    const k = id === "1" ? false : id;

    return (
      /* show forms that belongs to root */
      <div className="workplace-apps" onClick={this.RemoveRightSideBarElement}>
        {id === "1" &&
          tags.map((item, i) => {
            return (
              <div
                className="app-holder"
                key={i}
                onClick={() => this.openTag(item)}
              >
                <div className="tag-app-container" style={formStyle[item.id]}>
                  {item.image && (
                    <img
                      alt="form"
                      src={`${server}${item.image}`}
                      className="ss-tag-image"
                    ></img>
                  )}
                  <div className="tag-app-info"></div>
                  <div className="tag-app-body" style={formStyle[item.id]}>
                    {item.image && (
                      <img
                        alt="form"
                        src={`${server}${item.image}`}
                        className="ss-tag-image"
                      ></img>
                    )}
                  </div>
                  <div className="tag-app-info"></div>
                </div>
                <div className="tag-app-title">{item.title}</div>
              </div>
            );
          })}
        {forms[k] &&
          forms[k].map(item => {
            if (!item.is_empty) {
              return (
                <span
                  key={item.id}
                  onClick={() => {
                    this.props.updateData("SET_ACTIVE_ITEM", {
                      key: "activeFormDetails",
                      item
                    });

                    this.props.history.push(`/simplisend/${item.slug}`);
                    this.props.updateData("SET_LAST_OPENED_FORM", item);
                  }}
                >
                  <WorkplaceApp
                    item={item}
                    style={this.props.formStyle[item.category.id]}
                  />
                </span>
              );
            }
            return false;
          })}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    forms: state.saForms.forms,
    tags: state.saCatsReducer.tags,
    activeHeaderTag: state.ssheader.active,
    formStyle: state.formStyle.styles,
    selectedButtons: state.ssheader.selectedButtons,
    privatePassword: state.saCatsReducer.privatePassword,
    gottenPrivatePasswords: state.saCatsReducer.gottenPrivatePasswords,
    gottenPrivateTags: state.saCatsReducer.gottenPrivateTags
  };
};

const mapDispatchToProps = dispatch => {
  return {
    /* hide right sidebar element */
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkplaceApps);
