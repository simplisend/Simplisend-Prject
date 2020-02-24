const initState = {
  active: "1",
  showModal: false,
  showLangChoice: false,
  selectedButtons: []
};

const ssheaderReducer = (state = initState, action) => {
  switch (action.type) {
    /* decide which header button is active now */
    case "SS_HEADER_ACTIVE":
      return { ...state, active: action.data };

    /* whether to show the checkbox pop-up or not */
    case "SS_SHOW_MODAL":
      return { ...state, showModal: action.data };
    case "SS_SHOW_LANG-CHOISE":
      return { ...state, showLangChoice: action.data };

    /* save the selected  checkbox */
    case "SS_SELECTE_BUTTON":
      return { ...state, selectedButtons: [...action.data] };

    /* when user deletes an opend tag then update  opned tags in simplisend */
    case "UPDATE_SELECTED_BUTTONS":
      const obj = action.data.id + ";" + action.data.title;
      let i = 0;
      const updatedSelectedButtons = [];
      for (i; i < state.selectedButtons.length; i++) {
        const item = state.selectedButtons[i];
        if (item !== obj) {
          updatedSelectedButtons.push(item);
        }
      }
      return { ...state, selectedButtons: updatedSelectedButtons };

    default:
      return state;
  }
};

export default ssheaderReducer;
