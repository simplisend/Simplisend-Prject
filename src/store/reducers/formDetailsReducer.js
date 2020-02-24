const initState = {
  details: {} /* form forms in simplisend */,
  activeDetails: {} /* current active form in simpliBuilder */,
  elements: {} /* when rendering data in formDetails (to render data in right order )*/,
  requiredElements: {}
};

/* data for each form user gets this data  when clicking on a form in simplisend */
const formDetailsReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_REQUIRED_ELEMENT": {
      return {
        ...state,
        requiredElements: {
          ...state.requiredElements,
          [action.data.key]: action.data.value
        }
      };
    }

    case "SET_FORM_DETAILS":
      if (action.data.key) {
        const updatedDetails = { ...state[action.data.type] };
        updatedDetails[action.data.key] = action.data.details;
        return { ...state, [action.data.type]: updatedDetails };
      }

      return { ...state, activeDetails: action.data.details };

    case "SET_DETAILS":
      return { ...state, [action.data.type]: action.data.details };

    case "SET_DETAILS_ELEMENTS":
      const updatedElements = { ...state.elements };
      updatedElements[action.data.key] = action.data.elements;
      return { ...state, elements: updatedElements };

    default:
      return state;
  }
};

export default formDetailsReducer;
