import React, { Component } from "react";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import icons from "../../configs/icons";
import { request } from "../../funcs/http";
import { ClickOutsideComponent } from "../../components/utils";

const MAP_STATUS_TO_ICON = {
  open: icons.open,
  close: icons.close
};

class CatsListItem extends Component {
  state = { title: this.props.title };

  handleChange = e => this.setState({ title: e.target.value });

  renameItem = () => {
    const { activeTreeNode } = this.props;
    const updatedItem = {
      ...activeTreeNode,
      title: this.state.title,
      isCreated: true
    };

    /* if the user left the name as is */
    if (updatedItem.title === activeTreeNode.title) {
      const updatedActiveTreeNode = { ...activeTreeNode, isCreated: true };
      this.props.updateData("UPDATE_ACTIVE_TREE_NODE", updatedActiveTreeNode);
      return;
    }

    /* if user renamed the item */
    request(`tree/${activeTreeNode.id}/`, updatedItem, "put")
      .then(resp => {
        if (resp.status === 200) {
          const typ = `RENAME_${activeTreeNode.type}`;
          this.props.updateData(typ.toUpperCase(), updatedItem);
        }
      })
      .catch(e => {
        this.props.updateData("SET_MESSAGE_DATA", {
          title: "Error !",
          text: "An error occured so the process couldnt complete",
          showMessage: true
        });
        return;
      });
  };

  /* submit rename */
  handleKeyPress = e => {
    if (e.key === "Enter" && this.state.title) {
      this.renameItem();
    }
  };

  handleClick = () => {
    const { activeTreeNode, id } = this.props;
    if (activeTreeNode && activeTreeNode.id !== id) {
      this.props.updateData("SET_ACTIVE_FORM", null);
    }
    this.toggleItemActive();
  };

  toggleItemActive = () => {
    const {
      activeTreeNode,
      id,
      index,
      level,
      slug,
      canHaveFilters
    } = this.props;

    if (!activeTreeNode || activeTreeNode.id !== id) {
      slug !== "root" &&
        this.props.updateData("TOGGLE_TREE_ITEMS_VISIBILITY", {
          show: true,
          level,
          index,
          canHaveFilters
        });
      this.props.updateData("SET_ACTIVE_TREE_NODE", { ...this.props });
      return;
    } else {
      /* when user is renaming don't deactivate */
      if (activeTreeNode.isCreated) {
        this.props.updateData("SET_ACTIVE_TREE_NODE", null);
        slug !== "root" &&
          this.props.updateData("TOGGLE_TREE_ITEMS_VISIBILITY", {
            show: false,
            level,
            index
          });
      }
    }
  };

  /* when user updates tag name then update the selected tags in simplsend heaeder*/
  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.title !== prevProps.title && this.props.type === "tag") {
      const { selectedButtons, id } = this.props;

      if (!selectedButtons.length) {
        return;
      }

      const index = selectedButtons.indexOf(
        `${prevProps.id};${prevProps.title}`
      );
      const newTitle = this.props.title;
      const newType = `${id};${newTitle}`;
      const updatedSelectedButtons = [...selectedButtons];
      updatedSelectedButtons[index] = newType;

      this.props.updateData("SS_SELECTE_BUTTON", updatedSelectedButtons);

      /* if the updated tag was the active one then update the active one in simplisend */
      if (prevProps.active === `${prevProps.id};${prevProps.title}`) {
        this.props.updateData("SS_HEADER_ACTIVE", newType);
      }
    }
  };

  showComponentUpdate = (nextProps, nextState) => {
    if (this.props.activeTreeNode && !nextProps.tree.activeTreeNode) {
      return true;
    }

    if (this.props.activeTreeNode.id === nextProps.activeTreeNode.id) {
      return false;
    }
    return true;
  };

  render = () => {
    const {
      title,
      level,
      indentation,
      id,
      activeTreeNode,
      isCreated,
      type,
      show,
      isOpened,
      copiedItem,
      is_private
    } = this.props;

    let cls = `${type}`;
    if (activeTreeNode && activeTreeNode.id === id) {
      cls += " active";
    }

    if (copiedItem && copiedItem.id === id) {
      cls += " cuted_item";
    }
    let clas = `type-icon ${type}`;

    if (show) {
      return (
        <ClickOutsideComponent
          handleClick={this.renameItem}
          condition={isCreated === false}
        >
          <div
            onClick={this.handleClick}
            className={cls}
            style={{ paddingLeft: level === 1 ? 0 : level * indentation }}
          >
            <div className="cats-list-wrapper">
              <div className={clas}>
                {!isOpened && MAP_STATUS_TO_ICON["close"]}
                {isOpened && MAP_STATUS_TO_ICON["open"]}
              </div>

              <div className="type-title">
                {isCreated && title}

                {!isCreated && (
                  <input
                    type="text"
                    value={this.state.title}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    autoFocus={true}
                  />
                )}

                {is_private && type === "tag" && (
                  <p className="private-symbol">{icons.private}</p>
                )}
              </div>
            </div>
          </div>
        </ClickOutsideComponent>
      );
    }
    return null;
  };
}

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

const mapStateToProps = state => {
  return {
    /* change the style of the activated tree node */
    activeTreeNode: state.saCatsReducer.activeTreeNode,
    copiedItem: state.saCatsReducer.copiedItem,
    /* when user updates tag name then update the selected tags in simplsend heaeder*/
    selectedButtons: state.ssheader.selectedButtons,

    /* if the updated tag was the active one then update the active one in simplisend */
    active: state.ssheader.active
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatsListItem);
