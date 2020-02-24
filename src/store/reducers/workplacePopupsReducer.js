const initState = {
  shortText: false,
  dropList: false,
  activeElement: null,
  dropListDetails: false,
  checkBox: false,
  radioChoice: false,
  image: false,
  file: false,
  grid: false,
  svg: false,
  block: false,
  textBlock: false,
  simplisendBack: false
};

const workplacePopupsReducer = (state = initState, action) => {
  switch (action.type) {
    /* show popup for shortext */
    case "SHOW_SHORTTEXT":
      return { ...state, shortText: action.data };

    /* show popup for dropdown */
    case "SHOW_DROPLIST":
      return { ...state, dropList: action.data };

    case "SHOW_CHECKBOX":
      return { ...state, checkBox: action.data };

    case "SHOW_RADIOCHOICE":
      return { ...state, radioChoice: action.data };

    case "SHOW_DROPLIST_DETAILS":
      return { ...state, dropListDetails: action.data };

    case "SET_POPUP_ACTIVE_ELEMENT":
      return { ...state, activeElement: action.data };

    case "SHOW_IMAGE":
      return { ...state, image: action.data };

    case "SHOW_UPLOADFILE":
      return { ...state, file: action.data };

    case "SHOW_GRID":
      return { ...state, grid: action.data };

    case "SHOW_UPLOADSVG":
      return { ...state, svg: action.data };

    case "SHOW_BLOCK":
      return { ...state, block: action.data };

    case "SHOW_TEXTBLOCK":
      return { ...state, textBlock: action.data };

    case "SHOW_SIMPLISEND_BACK_POPUP":
      return { ...state, simplisendBack: action.data };

    default:
      return state;
  }
};

export default workplacePopupsReducer;
