import icons from "../../configs/icons";

const buttons = {
  container: {
    form: [
      { title: "heading", icon: icons.heading, type: "heading" },
      { title: "askAnswer", icon: icons.ask, type: "askAnswer" },
      { title: "info", icon: icons.info, type: "info" }
    ],
    paper: [{ title: "block", icon: icons.header, type: "block" }],
    "pop-up": [],
    filter: [],
    empty: []
  },

  element: {
    form: [
      { title: "shortText", icon: icons.shortText, type: "shortText" },
      { title: "textArea", icon: icons.textArea, type: "textArea" },
      { title: "heading", icon: icons.heading, type: "header" },
      { title: "dropList", icon: icons.dropList, type: "dropList" },
      { title: "radioChoice", icon: icons.radio, type: "radioChoice" },
      { title: "checkBox", icon: icons.checkBox, type: "checkBox" },
      { title: "image", icon: icons.image, type: "image" },
      { title: "uploadFile", icon: icons.uploadFile, type: "uploadFile" },
      { title: "signature", icon: icons.signature, type: "signature" },
      { title: "textBlock", icon: icons.shortText, type: "textBlock" }
    ],
    paper: [
      { title: "grid", icon: icons.table, type: "grid" },
      { title: "uploadFile", icon: icons.image, type: "uploadSvg" }
    ],
    "pop-up": [],
    filter: [],
    empty: []
  },
  library: {
    form: [],
    paper: [],
    "pop-up": [],
    filter: [],
    empty: []
  },
  property: {
    form: [],
    paper: [],
    "pop-up": [],
    filter: [],
    empty: []
  },
  condition: {
    form: [],
    paper: [],
    "pop-up": [],
    filter: [],
    empty: []
  }
};

const initState = { title: null, block: null, buttons };

const sideBarReducer = (state = initState, action) => {
  switch (action.type) {
    case "SIDEBAR_BLOCK":
      return { ...state, block: action.data };

    case "SIDEBAR_TITLE":
      return { ...state, title: action.data };

    case "UPDATE_SIDE_BAR_BLOCK_BUTTONS":
      const newButtons = {
        ...state.buttons,
        [buttons[state.title][state.block]]: action.data
      };

      return { ...state, buttons: newButtons };

    default:
      return state;
  }
};

export default sideBarReducer;
