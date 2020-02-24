const initState = { styles: {} };

const formStyleReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_FORM_STYLE":
      return {
        ...state,
        styles: { ...state.styles, [action.data.id]: action.data.style }
      };

    default:
      return state;
  }
};

export default formStyleReducer;
