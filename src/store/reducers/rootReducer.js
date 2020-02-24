import { combineReducers } from "redux";
import sideBarReducer from "./sidebarReducer";
import headerReducer from "./headerReducer";
import workplaceReducer from "./workplaceReducer";
import formToolBarReducer from "./formToolBarReducer";
import langReducer from "./langReducer";
import workPlacePageReducer from "./workPlacePageReducer";
import droppablesReducer from "./droppablesReducer";
import starterScreenReducer from "./starterScreenReducer";
import ssheaderReducer from "./ssheaderReducer";
import ssRightSidebarReducer from "./ssRightSidebarReducer";
import saRightSidebarReducer from "./saRightSidebarReducer";
import saLeftSidebarReducer from "./saLeftSidebarReducer";
import ssLeftSidebarReducer from "./ssLeftSidebarReducer";
import ssClassToggler from "./ssClassToggler";
import saClassToggler from "./saClassToggler";

import saCatsReducer from "./saCatsReducer";
import saFormsReducer from "./saFormsReducer";
import authReducer from "./authReducer";
import messagesReducer from "./messagesReducer";
import formDetailsReducer from "./formDetailsReducer";
import workplacePopupsReducer from "./workplacePopupsReducer";
import activeItemsReducer from "./activeItemsReducer";
import workplaceElementsReducer from "./workplaceElementsReducer";
import translationReducer from "./translationReducer";
import TempDataReducer from "./tempData";
import formStyleReducer from "./formStyle";

const rootReducer = combineReducers({
  sideBar: sideBarReducer /* form builder left side bar */,
  header: headerReducer /* form builder header  */,
  workplace: workplaceReducer /* form builder workplace */,
  formToolBar: formToolBarReducer /* formbuilde toolbar */,
  lang: langReducer /* language */,
  workPlacePage: workPlacePageReducer /* form builder workplace page */,
  droppables: droppablesReducer /* form builder droppables */,
  starter: starterScreenReducer /* form builder starter screen */,
  ssheader: ssheaderReducer /* simplisend header */,
  ssRightSidebar: ssRightSidebarReducer /* simplisend right sidebar */,
  saRightSidebar: saRightSidebarReducer /* simpliadmin right sidebar */,
  saLeftSidebar: saLeftSidebarReducer /* simpliadmin left sidebar */,
  ssLeftSidebar: ssLeftSidebarReducer /* simplisend left sidebar */,
  ssClassToggler: ssClassToggler /* simplisend  layout ssClassToggler */,
  saClassToggler: saClassToggler /* simpliadmin layout saClassToggler */,

  saCatsReducer: saCatsReducer /* simpliadmin categoreis reducer */,
  saForms: saFormsReducer,
  auth: authReducer /* whether user is logged in or not */,
  messages: messagesReducer,
  formDetails: formDetailsReducer,
  tempData: TempDataReducer,
  /*
    when user drops an element in a workplace droppable
    show corresponding popup
  */
  workplacePopups: workplacePopupsReducer,
  activeItems: activeItemsReducer,
  workplaceElements: workplaceElementsReducer /* which workplace element (heading ...) is active now */,
  translation: translationReducer /* all translated words */,
  formStyle: formStyleReducer
});

export default rootReducer;
