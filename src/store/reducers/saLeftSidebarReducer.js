import icons from "../../configs/icons";

const buttons = {
  tools: [
    {
      id: 1,
      title: "User management",
      symbol: icons.redo,
      text:
        "Radio buttons are normally presented in groups (a collection of radio buttons describing a set of related options). Only one radio button in a group can be selected at the same time."
    },
    {
      id: 2,
      title: "Personal information",
      symbol: icons.redo,
      text:
        "Radio buttons are normally presented in groups (a collection of radio buttons describing a set of related options). Only one radio button in a group can be selected at the same time."
    }
  ]
};

const initState = { buttons, activeButton: null, translatorIsOpened: false };

const saLeftSidebarReducer = (state = initState, action) => {
  switch (action.type) {
    /* decide which left sidebar button is active now */
    case "SA_LEFT_SIDE_BAR_ACTIVE":
      return { ...state, activeButton: action.data };

    case "SA_SET_TRANSLATOR_IS_OPENED":
      return { ...state, translatorIsOpened: action.data };

    default:
      return state;
  }
};

export default saLeftSidebarReducer;
