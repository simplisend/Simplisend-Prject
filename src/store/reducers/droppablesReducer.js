const initState = {
  droppables: {},
  isWorkPlaceDraggablesActive: false,
  isRightDroppableActive: false
};

const droppablesReducer = (state = initState, action) => {
  let newDroppalbes;

  switch (action.type) {
    case "SET_DROPABLES":
      return { ...state, droppables: action.data };

    /* for general droppables */
    /* trigger by ElementsTree in utils */
    case "ADD_DROPPABLE":
      newDroppalbes = {
        ...state.droppables,
        [action.data.key]: action.data.column ? action.data.column : []
      };
      return { ...state, droppables: newDroppalbes };

    /* when user drag  content into one of the elements above (from the side bar) */
    /* when user move element across the same column */
    case "ADD_ELEMENT_TO_DROPPABLE":
      /* add new item to workplace element droppable */
      newDroppalbes = {
        ...state.droppables,
        [action.data.key]: action.data.column
      };
      return { ...state, droppables: newDroppalbes };

    /* when dragging elements between 2 different workplace containers */
    case "MOVE_ELEMENT_ACROSS_WORKPLACE_CONTAINERS":
      return {
        ...state,
        droppables: {
          ...state.droppables,
          [action.data.sourceKey]: action.data.sourceColumn,
          [action.data.destinationKey]: action.data.destinationColumn
        }
      };

    case "SET_RIGHT_DROPPABLE_ACTIVE":
      return { ...state, isRightDroppableActive: action.data };

    /* whether workplace draggables should be active or not */
    case "WORK_PLACE_DRAGGABLES_ACTIVITY":
      return { ...state, isWorkPlaceDraggablesActive: action.data };

    default:
      return state;
  }
};

export default droppablesReducer;
