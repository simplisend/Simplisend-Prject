/* map buttons in the form toolbar to buttons and pages in workplace Container */
/* use this for updating items and active buttons and pages */
const mapWorkPlaceItemsToFormToolBarButtons = {
  "btn-Form_Nav": {
    button: { cls: "builderTag", id: "btn-B_TagForm", name: "form" },
    page: { id: "formContainer", cls: "wpContainer", zIndex: 1, name: "form" }
  },
  "btn-Paper_Nav": {
    button: { cls: "builderTag", id: "btn-B_TagPaper", name: "paper" },
    page: { id: "paperContainer", cls: "wpContainer", zIndex: 2, name: "paper" }
  },
  "btn-PopUp_Nav": {
    button: { cls: "builderTag", id: "btn-B_TagPop-up", name: "pop-up" },
    page: {
      id: "pop-UpContainer",
      cls: "wpContainer",
      zIndex: 3,
      name: "pop-up"
    }
  },
  "btn-Filter_Nav": {
    button: { cls: "builderTag", id: "btn-B_TagFilter", name: "filter" },
    page: {
      id: "filterContainer",
      cls: "wpContainer",
      zIndex: 4,
      name: "filter"
    }
  }
};

/* map workplace buttons with ids and classes of workplace buttons and workplace pages */
/* use this for updating active pages and buttons */
const MapWorkPlaceButtonsToActive = {
  "btn-B_TagForm": {
    activePage: "formContainer",
    activeButton: "btn-B_TagForm"
  },
  "btn-B_TagPaper": {
    activePage: "paperContainer",
    activeButton: "btn-B_TagPaper"
  },
  "btn-B_TagFilter": {
    activePage: "filterContainer",
    activeButton: "btn-B_TagFilter"
  },
  "btn-B_TagPop-up": {
    activePage: "pop-UpContainer",
    activeButton: "btn-B_TagPop-up"
  }
};

/* items will be added based on ids */
const initState = {
  items: [],
  ids: [],
  currentActivePage: null,
  currentActiveButton: null,
  isDivided: false
};

const workplaceReducer = (state = initState, action) => {
  switch (action.type) {
    case "RESET_PAGES":
      return {
        ...state,
        ids: ["btn-Form_Nav"],
        currentActivePage: "formContainer",
        items: [mapWorkPlaceItemsToFormToolBarButtons["btn-Form_Nav"]],
        currentActiveButton: "btn-B_TagForm"
      };

    case "PAGE":
      const newIds = state.ids;
      const index = newIds.indexOf(action.data);
      let activePage, activeButton;
      /*  update ids */
      if (index === -1) {
        newIds.push(action.data);
      } else {
        newIds.splice(index, 1);
      }

      /* update items */
      const newItems = [];
      Object.keys(mapWorkPlaceItemsToFormToolBarButtons).map(itemId => {
        if (newIds.indexOf(itemId) !== -1) {
          newItems.push(mapWorkPlaceItemsToFormToolBarButtons[itemId]);
        }
        return null;
      });

      /* update current active page/button  based on ( newItems) */
      if (index === -1) {
        /* if user is adding new item then set this item (button/page ) as active item */
        activePage = mapWorkPlaceItemsToFormToolBarButtons[action.data].page.id;
        activeButton =
          mapWorkPlaceItemsToFormToolBarButtons[action.data].button.id;
      } else {
        /* if user is removing item then set the last existing item as active if any else no item is active*/
        activePage =
          newItems.length >= 1 ? newItems[newItems.length - 1].page.id : null;
        activeButton =
          newItems.length >= 1 ? newItems[newItems.length - 1].button.id : null;
      }

      return {
        ...state,
        items: newItems,
        ids: newIds,
        currentActivePage: activePage,
        currentActiveButton: activeButton
      };

    /* update which workplace button is active now (form,pop-up,......)*/
    case "UPDATE_ACTIVE":
      const id = action.data;
      const activePge = MapWorkPlaceButtonsToActive[id].activePage;
      const activeBtn = MapWorkPlaceButtonsToActive[id].activeButton;
      return {
        ...state,
        currentActivePage: activePge,
        currentActiveButton: activeBtn
      };

    /* whether to divide thg workplace or not */
    case "DIVIDE":
      return { ...state, isDivided: action.data };

    default:
      return state;
  }
};

export default workplaceReducer;
