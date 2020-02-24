const initState = { isChanged: true };

const ssClassToggler = (state = initState, action) => {
  switch (action.type) {
    case "CLASS-TOGGLER":
      return { ...state, isChanged: !state.isChanged };

    default:
      return state;
  }
};

export default ssClassToggler;
