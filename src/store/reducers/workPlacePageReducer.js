const initState = {
  form: [],
  paper: [],
  "pop-up": [],
  filter: [],
  activeWorkplaceElement: null
};

/* reducer for each work place page */
const workPlacePageReducer = (state = initState, action) => {
  switch (action.type) {
    /* add new asnAnswer component */
    case "ASKANSWER":
      return {
        ...state,
        form: [
          ...state.form,
          {
            question: "question_Text",
            answer: "answer_Text",
            type: "askAnswer",
            blockType: "form"
          }
        ]
      };

    /* add new heading component */
    case "HEADING":
      return {
        ...state,
        form: [
          ...state.form,
          {
            title: "heading_Text",
            type: "heading",
            blockType: "form"
          }
        ]
      };

    /* add new info component */
    case "INFO":
      return {
        ...state,
        form: [
          ...state.form,
          { text: "info_Text", type: "info", blockType: "form" }
        ]
      };

    case "BLOCK":
      return {
        ...state,
        paper: [
          ...state.paper,
          { text: "block_Text", type: "block", blockType: "paper" }
        ]
      };

    /* which workplace element the user is wroking on right now */
    case "SET_ACTIVE_WORKPLACE_ELEMENT":
      return { ...state, activeWorkplaceElement: action.data };

    default:
      return state;
  }
};

export default workPlacePageReducer;
