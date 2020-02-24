const initState = {
  searchedLang : null,/* which words to get based on active form lanuage */
  langsTable : {}, /* words for each language */
  autoCompleteOptions : null ,/* matching words for what user is typing */
  showAutoCompleteOptions : null , /* whether to show auto-complete list for user to chose from or not */
  showAutoCompleteOptionsPopup : null,
  newWords : {} , /* new words to be saved */
  langs : [] , /* all languages in database */
  orderedWords : {} ,
} ;

const translationReducer = (state = initState,action) => {

  switch (action.type) {

    case 'SET_SEARCHED_LANG':
      return { ...state,searchedLang: action.data }

    case 'SET_LANG_WORDS':
      return { ...state, langsTable : {...state.langsTable , [action.data.key]: action.data.words }}

    case  "SET_AUTO_COMPLETE_OPTIONS" :
      return { ...state , autoCompleteOptions : action.data }

    case "SHOW_AUTO_COMPLETE_OPTIONS" :
      return { ...state, showAutoCompleteOptions : action.data }

    case "SHOW_AUTO_COMPLETE_OPTIONS_POPUP" :
      return { ...state, showAutoCompleteOptionsPopup : action.data }

    case "ADD_NEW_WORD" :
      if (action.data.words) {
        return { ...state, newWords : { ...action.data.words } }
      }
      return { ...state, newWords : {...state.newWords , [action.data.key] : action.data.text }}


    case "SET_LANGS" :
      return { ...state ,langs : [...action.data] }

    case "SET_ORDERED_WORDS" :
      return { ...state, orderedWords : {...state.orderedWords , [action.data.key] : action.data.words }}

    case "RESET_ORDERED_WORDS" :
        return { ...state , orderedWords : {} }

    case 'RESET_NEW_WORDS' :
      return { ...state , newWords : {} }

    default:
      return state ;

  }


}

export default translationReducer ;
