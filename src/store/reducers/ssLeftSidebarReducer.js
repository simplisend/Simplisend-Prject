import React from "react";
import icons from "../../configs/icons";
import Translator from "../../components/utils/translator";

import Filter from "./../../simplisendComponents/layout/sidebar/rightSidebar/rightSidebarElements/filter";
const buttons = {
  categoryFilter: [
    {
      id: 1,
      title: <Translator string="ChooseCategory" />,
      symbol: icons.filterNav,
      text: <Filter />
    }
  ]
};

const initState = { buttons, activeButton: null };

const ssLeftSidebarReducer = (state = initState, action) => {
  switch (action.type) {
    /* decide which right sidebar button is active now */
    case "SS_LEFT_SIDE_BAR_ACTIVE":
      return { ...state, activeButton: action.data };

    default:
      return state;
  }
};

export default ssLeftSidebarReducer;
