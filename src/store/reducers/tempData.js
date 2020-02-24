const initState = { simplisendForms: {}, lastOpenedForm: null };

const TempDataReducer = (state = initState, action) => {
  switch (action.type) {
    case "SAVE_SIMPLISEND_TEMP_FORM":
      return {
        ...state,
        simplisendForms: {
          ...state.simplisendForms,
          [action.data.key]: action.data.form
        }
      };

    case "SET_LAST_OPENED_FORM":
      return { ...state, lastOpenedForm: action.data };

    case "REMOVE_FORM_TEMP_DATA": {
      const updatedFormsTempData = { ...state.simplisendForms };
      if (updatedFormsTempData[action.data]) {
        delete updatedFormsTempData[action.data];
        return { ...state, simplisendForms: updatedFormsTempData };
      }
      return { ...state };
    }

    default:
      return state;
  }
};

export default TempDataReducer;
