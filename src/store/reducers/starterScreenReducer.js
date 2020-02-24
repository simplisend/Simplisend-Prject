const initState = {

  show : true,/* whether to show starter screen or not */
  showSelectFormScreen : false, /* when user wants to open an existing form */
  showSelectFile : false , /* when user wants to save a form */
  showRenameFormWarning : false, /* when user wants to open new fprm show warning message */
  userOpensExistingForm : false , /* when user clicks on open form in simpli builder */
  showSelectLang : false ,
} ;

const starterScreenReducer = (state = initState,action) => {

  switch (action.type) {

    case 'TOGGLE_STARTER_SCREEN':
      return { ...state,show: action.data }

    case "SHOW_SELECT_SCREEN" :
      return { ...state , showSelectFormScreen : action.data }

    case "SHOW_SELECT_FILE" :
      return { ...state , showSelectFile : action.data }

    case "SHOW_RENAME_FORM_WARNING" :
      return { ...state , showRenameFormWarning : action.data }


    case 'SET_OPEN_EXISTING_FORM' :
      return { ...state , userOpensExistingForm : action.data }

    case 'SHOW_SELECTE_LANG' :
      return { ...state , showSelectLang : action.data }

    default:
      return state ;

  }


}

export default starterScreenReducer ;
