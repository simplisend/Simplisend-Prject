const initState = { active: "form", showHeaderButton: false };

const headerReducer = (state = initState, action) => {
  switch (action.type) {
    /* decide which header button is active now */
    case "ACTIVE":
      return { ...state, active: action.data };

    /* whether to show header buttons or not */
    case "SHOW_BUTTONS":
      return { ...state, showHeaderButton: action.data };

    default:
      return state;
  }
};

export default headerReducer;
