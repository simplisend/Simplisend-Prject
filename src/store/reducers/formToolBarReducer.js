const initState = {
    selectEditActive : 'btn-Select', /* only one button can be active */
    selected : [] , /* selected buttons in form tool bar */

} ;


const formToolBarReducer = (state = initState,action) => {

  switch (action.type) { /* add to selected buttons */
    case 'UPDATE_SELECTED':
      return {...state, selected : [...action.data ]}

    case 'UPDATE_FORM_TOOL_BAR_ACTIVE' :/* change the active button */
      return { ...state,selectEditActive : action.data }

    default:
      return state ;

  }


}

export default formToolBarReducer ;
