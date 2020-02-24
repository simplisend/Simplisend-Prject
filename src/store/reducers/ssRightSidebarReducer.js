import icons from "../../configs/icons";

const buttons = [
  {
    id: 1,
    title: "login_register",
    symbol: icons.login,
    type: "login_register"
  },
  { id: 2, title: "mail", symbol: icons.mail, type: "mail" },
  { id: 3, title: "library", symbol: icons.library, type: "library" },
  { id: 4, title: "settings", symbol: icons.property, type: "settings" }
];

const initState = { buttons, activeButton: null, element: null };

const ssRightSidebarReducer = (state = initState, action) => {
  switch (action.type) {
    /* decide which right sidebar button is active now */
    case "SS_RIHGT_SIDE_BAR_ACTIVE":
      return { ...state, activeButton: action.data };

    /* when clicking on a right sidebar button display the corresponding element */
    case "SET_RIGHT_SIDEBAR_ELEMENT":
      return { ...state, element: action.data };

    default:
      return state;
  }
};

export default ssRightSidebarReducer;
