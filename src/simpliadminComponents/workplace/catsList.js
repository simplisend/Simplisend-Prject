import React, { Component } from "react";
import CatsListItem from "./catsListItem";
import { connect } from "react-redux";
import { updateData } from "../../store/actions/rootActions";
import arrayTree from "array-to-tree";
import { Translator } from "../../components/utils";
import icons from "../../configs/icons";
import messages from "../../configs/messages";
import { request, getRequest } from "../../funcs/http";

const findItemChilds = (seq, level, result = [], n = 0) => {
  if (n >= seq.length) {
    return result;
  }
  const item = seq[n];
  if (item.level <= level) {
    return result;
  }
  result.push(item);
  return findItemChilds(seq, level, result, n + 1);
};

const findFirstTag = (seq, level, n) => {
  const item = seq[n];
  if (item.type === "tag" && item.level < level) {
    return item;
  }

  return findFirstTag(seq, level, n - 1);
};

class CatsList extends Component {
  setDeletionMessage = () => {
    const { activeFormsListTag, forms, activeTreeNode } = this.props;
    let type = "master";
    let messageKey = "confirmDeletion";
    if (activeTreeNode && activeTreeNode.slug !== "root") {
      type = `${activeFormsListTag}_${activeTreeNode.id}`;
    }

    if (type === "master" && forms["master"] && forms["master"].length) {
      messageKey = "confirmNoneEmptyDeletion";
      this.props.updateData("SET_FORM_DELETION_MESSAGE_KEY", messageKey);
      return;
    }

    if (
      (forms[`form_${activeTreeNode.id}`] &&
        forms[`form_${activeTreeNode.id}`].length) ||
      (forms[`sub-form_${activeTreeNode.id}`] &&
        forms[`sub-form_${activeTreeNode.id}`].length)
    ) {
      messageKey = "confirmNoneEmptyDeletion";
      this.props.updateData("SET_FORM_DELETION_MESSAGE_KEY", messageKey);
      return;
    }

    this.props.updateData("SET_FORM_DELETION_MESSAGE_KEY", "confirmDeletion");
  };

  deleteItem = () => {
    const { activeTreeNode } = this.props;
    if (!activeTreeNode) {
      return;
    }
    if (activeTreeNode && activeTreeNode.id === 1) {
      return;
    }
    this.setDeletionMessage();
    this.props.updateData("SHOW_CAT_DELETION_MESSAGE", true);
  };

  /* show add tree item popup */
  showPopup = () => {
    const { activeTreeNode } = this.props;
    if (activeTreeNode) {
      this.props.updateData("SHOW_CAT_OPTIONS_POPUP", true);
    }
  };

  /* cut tree item */
  handleCopyClick = () => {
    const { activeTreeNode, copiedItem } = this.props;
    if (!activeTreeNode || activeTreeNode.slug === "root") {
      return;
    }

    if (copiedItem && copiedItem.id === activeTreeNode.id) {
      this.props.updateData("SET_COPIED_ITEM", null);
      return;
    }
    this.props.updateData("SET_COPIED_ITEM", activeTreeNode);
  };

  pastItem = () => {
    const { activeTreeNode, copiedItem, tree, lang } = this.props;
    /* if the user didn't select an item to copy or an item to paste into it*/
    if (!activeTreeNode || !copiedItem) {
      this.props.updateData("SET_COPIED_ITEM", null);
      return;
    }
    /* if user copied the item and pasted it to itself */
    if (activeTreeNode.id === copiedItem.id) {
      this.props.updateData("SET_COPIED_ITEM", null);
      return;
    }

    /* if the user pasted the copied item to the same parent then do nothing */
    if (copiedItem.parent === activeTreeNode.id) {
      this.props.updateData("SET_COPIED_ITEM", null);
      this.props.updateData("SET_ACTIVE_TREE_NODE", null);
      return;
    }

    /* user can cut a filter only to category or tag */
    if (
      copiedItem.type === "filter" &&
      activeTreeNode.type !== "cat" &&
      activeTreeNode.type !== "tag"
    ) {
      const title = messages[lang]["filterCutError"]["title"];
      const text = messages[lang]["filterCutError"]["text"];
      this.props.updateData("SET_MESSAGE_DATA", {
        title,
        text,
        showMessage: true
      });
      this.props.updateData("SET_COPIED_ITEM", null);
      return;
    }

    /* u can cut a sub-filter only to filter item */
    if (copiedItem.type === "sub-filter" && activeTreeNode.type !== "filter") {
      const title = messages[lang]["subFilterCutError"]["title"];
      const text = messages[lang]["subFilterCutError"]["text"];
      this.props.updateData("SET_MESSAGE_DATA", {
        title,
        text,
        showMessage: true
      });
      this.props.updateData("SET_COPIED_ITEM", null);
      return;
    }

    /* user can't cut a tag item */
    if (copiedItem.type === "tag") {
      const title = messages[lang]["tagCutError"]["title"];
      const text = messages[lang]["tagCutError"]["text"];
      this.props.updateData("SET_MESSAGE_DATA", {
        title,
        text,
        showMessage: true
      });
      this.props.updateData("SET_COPIED_ITEM", null);
      return;
    }

    /* differnce bettween the copied item level and the copied to item level */
    const differ = activeTreeNode.level - copiedItem.level;
    /* updated level for childs of copied item */
    const childs = findItemChilds(
      [...tree].slice(copiedItem.index + 1),
      copiedItem.level
    );
    const seq = [...this.props.tree].slice(0, activeTreeNode.index + 1);
    const newParentTag =
      activeTreeNode.type === "tag"
        ? activeTreeNode
        : findFirstTag(seq, activeTreeNode.level, seq.length - 1);

    const payload = {
      id: copiedItem.id,
      type: copiedItem.type,
      parent: activeTreeNode.id,
      level: activeTreeNode.level + 1,
      childs,
      differ: differ + 1,
      parent_tag: newParentTag
    };

    this.props.updateData("SHOW_PROCESSING", true);

    request(`tree/${copiedItem.id}/`, payload, "PUT")
      .then(resp => {
        this.props.updateData("SHOW_PROCESSING", false);
        this.props.updateData("SET_COPIED_ITEM", null);
        this.props.updateData("SET_ACTIVE_TREE_NODE", null);
        this.props.updateData("SET_CATS", resp.data);
        this.props.updateData("REMOVE_FORMS", "all");
        this.props.updateData("SET_FILTERS", {});
      })
      .catch(e => {
        this.props.updateData("SHOW_PROCESSING", false);
        this.props.updateData("SET_MESSAGE_DATA", {
          title: "Error !",
          text: "An error occured so the process couldn't complete",
          showMessage: true
        });
        this.props.updateData("SET_COPIED_ITEM", null);
        this.props.updateData("SET_ACTIVE_TREE_NODE", null);
      });
  };

  buildTree = (seq, result = []) => {
    /*array-to-tree will always look for the item id so u should make the lookup field and id idecntical*/
    seq.map((item, i) => {
      result.push({
        id: item.id,
        title: item.title,
        level: item.level,
        type: item.type,
        isCreated: item.isCreated ? item.isCreated : true,
        canHaveFilters:
          item.canHaveFilters !== undefined
            ? item.canHaveFilters
            : item.can_have_filters,
        show: item.show ? item.show : item.level <= 2 ? true : false,
        isOpened: item.isOpened
          ? item.isOpened
          : item.level === 1
          ? true
          : false,
        slug: item.slug,
        parent: item.parent,
        parent_tag: item.parent_tag,
        is_private: item.is_private,
        image: item.image,
        private_password: item.private_password
      });

      if (item.children) {
        result = this.buildTree(item.children, result);
      }

      return null;
    });
    return result;
  };

  componentDidMount = () => {
    if (this.props.cats.length === 0) {
      getRequest("tree/").then(resp => {
        if (resp.status === 200) {
          this.props.updateData("SET_CATS", resp.data);
        }
      });
    }
  };

  /* every time the user adds or removes new item to/from the tree */
  componentDidUpdate = (prevProps, prevState) => {
    const { cats } = this.props;
    /* when getting tree items for the first time */
    if (!prevProps.cats.length && this.props.cats.length) {
      const arr = arrayTree(cats, { parentProperty: "parent" });
      const t = this.buildTree(arr);
      this.props.updateData("CREATE_TREE", t);
      return;
    }

    /* every time the user adds new tree item */
    if (
      prevProps.tree.length &&
      prevProps.tree.length !== this.props.tree.length
    ) {
      const { tree } = this.props;
      const arr = arrayTree(tree, { parentProperty: "parent" });
      const newTree = this.buildTree(arr);
      this.props.updateData("CREATE_TREE", newTree);
      return;
    }

    if (prevProps.cats.length !== this.props.cats.length) {
      const arr = arrayTree(cats, { parentProperty: "parent" });
      const t = this.buildTree(arr);
      this.props.updateData("CREATE_TREE", t);
      return;
    }

    let shouldUpdate;

    if (prevProps.cats.length && this.props.cats.length) {
      for (var i = 0; i < cats.length; ++i) {
        if (prevProps.cats[i]["parent"] !== this.props.cats[i]["parent"]) {
          shouldUpdate = true;
          break;
        }
      }
    }

    if (shouldUpdate) {
      const arr = arrayTree(cats, { parentProperty: "parent" });
      const t = this.buildTree(arr);
      this.props.updateData("CREATE_TREE", t);
      return;
    }
  };

  /* when user clicks on rename button (not when the user confirms rename)*/
  handleRenameClick = () => {
    const { activeTreeNode } = this.props;

    if (activeTreeNode && activeTreeNode.id !== 1) {
      const updatedActiveTreeNode = { ...activeTreeNode, isCreated: false };
      this.props.updateData("UPDATE_ACTIVE_TREE_NODE", updatedActiveTreeNode);
    }
  };

  render = () => {
    const { tree, activeTreeNode, copiedItem } = this.props;
    const cls = activeTreeNode ? "symbol-btn" : "transparent";

    return (
      <div className="list-wrapper">
        <h3 className="tree-title">
          <Translator string="catsTree" />
        </h3>
        <div className="buttons-wrapper">
          <button className="symbol-btn" onClick={this.showPopup}>
            {icons.add}
            <p className="discription">
              <Translator string="add" />
            </p>
          </button>

          <button className={cls} onClick={this.handleRenameClick}>
            {icons.rename}
            <p className="discription">
              <Translator string="rename" />
            </p>
          </button>

          <button className={cls} onClick={this.handleCopyClick}>
            {icons.cut}
            <p className="discription">
              <Translator string="cut" />
            </p>
          </button>
          <button
            className={copiedItem ? "symbol-btn" : "transparent"}
            onClick={this.pastItem}
          >
            {icons.paste}
            <p className="discription">
              <Translator string="paste" />
            </p>
          </button>
          <button className={cls} onClick={this.deleteItem}>
            {icons.delete}
            <p className="discription">
              <Translator string="delete" />
            </p>
          </button>
        </div>
        <div className="tree-wrapper">
          {tree &&
            tree.length > 0 &&
            tree.map((item, i) => {
              return (
                <CatsListItem {...item} indentation={6} key={i} index={i} />
              );
            })}

          {!tree && <h2>Loading ...</h2>}
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    /* when user gets the items for the first time */
    cats: state.saCatsReducer.cats,

    /* every time the user adds new item */
    tree: state.saCatsReducer.tree,

    activeTreeNode: state.saCatsReducer.activeTreeNode,

    /* when user selectes an item to cut and past in another place */
    copiedItem: state.saCatsReducer.copiedItem,
    lang: state.lang.lang,
    filters: state.saCatsReducer.filters,
    forms: state.saForms.forms,
    activeFormsListTag: state.activeItems.activeFormsListTag
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateData: (type, data) => dispatch(updateData(type, data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CatsList);
