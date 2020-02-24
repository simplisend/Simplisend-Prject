const initState = {
  activeFormsListTag : 'form' ,
  selectedForm : null , /* current opened form in simpli builder  */
  autoCompleteActiveItem : null ,/* which component is getting auto complete data */
  activeTranslationTableItem : null, /* which translation table item is active */
  activeAutoCompleteItem : null , /* to which component auto complete list belongs */
  activeFormDetails : null , /* which from is opened in simplisend */

  /* whether user is in simpliBuilder or not */
  isSimpliBuilderActive : false ,

  /* when user clicks on a link in dropdown menu in simpli builder */
  /* i need this variable so i can change the default behavior of some methods such as (discard changes and save)*/
  isSimpliBuilderNavButtonClicked : false ,

  /* which page user wants to navigate to*/
  activeNavLink : null ,

  /* when user clicks new form button in header in simpliBuilder */
  isNewFormButtonClicked : false ,

  isDuplicateFormButtonClicked : false ,

  /* which cropped image is active now (one form can have multiple images to be cropped)*/
  activeCroppedImageUrl : '' ,

  /* which static page is active now (footer links)*/
  activeStaticPage : null ,

  /* content of general discription */
  activeGeneralDiscription : null,
  activeGridCell : null ,

} ;

const activeItemsReducer = (state = initState,action) => {

  switch (action.type) {

    case 'SET_ACTIVE_ITEM':
      return {...state,[action.data.key ] : action.data.item }

    default:
      return state ;

  }

}

export default activeItemsReducer ;
