const initState = { isChanged: true };

const saClassToggler = (state = initState, action) => {
  switch (action.type) {
    case "SA-CLASS-TOGGLER":
      return { ...state, isChanged: !state.isChanged };

    default:
      return state;
  }
};

export default saClassToggler;
