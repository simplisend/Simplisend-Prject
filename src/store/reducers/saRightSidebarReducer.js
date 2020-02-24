import icons from "../../configs/icons";

const buttons = [{ id: 2, title: "settings", symbol: icons.property }];

const initState = { buttons, activeButton: null };

const saRightSidebarReducer = (state = initState, action) => {
  switch (action.type) {
    /* decide which right sidebar button is active now */
    case "SS_RIHGT_SIDE_BAR_ACTIVE":
      return { ...state, activeButton: action.data };

    case "SET_SA_RIGHT_SIDEBAR_ELEMENT":
      return { ...state, element: action.data };

    default:
      return state;
  }
};

export default saRightSidebarReducer;
