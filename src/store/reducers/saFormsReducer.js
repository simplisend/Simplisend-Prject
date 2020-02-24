/* use this function when removing / renaming a form */
const findElement = (seq,id,n) => {
  if (n >= seq.length) { return n - 1}
  const item = seq[n] ;
  if (item.id === id) { return n }
  return findElement(seq,id,n+1) ;
}

const initState = {
  forms : {} ,
  showAddPopup : false,
  activeForm : null,
  showFormDeletionMessage : false,
  showCopyFormPopup : false,
  copiedForm : null ,

} ;


const saFormsReducer = (state = initState,action) => {
  let updatedForms,updatedPart,elementIndex,updatedAllForms,type,form,key,forms ;
  switch (action.type) {

    /* when user gets forms for the first time */
    case 'SET_FORMS':
      key = action.data.key ;
      forms = action.data.forms ;

      if (forms) {
        /* for each form set isCreated (for rename purposes) and index attributes */
        forms.map((item,i) => {
          item['isCreated'] = true
          item['index'] = i

          return null
        })

        /* if no forms at all then add a new key */
        if (!Object.keys(state.forms).length) {
            return {...state,forms : {[key] : forms }}
        }

        /* if there are forms but no forms belongs to this item then add this item and all it's forms */

      }
        return { ...state,forms : {...state.forms , [key] : forms } }



    /* add new form */
    case 'ADD_FORM' :

      key = action.data.key ;
      form = action.data.form ;

      updatedPart = state.forms[key] ;
      if (updatedPart) {
        updatedPart.push({...action.data.form,index : updatedPart.length -1 })
      } else {
        updatedPart = [{...action.data.form,index : 0  }]
      }

      /* if the user gets all none private forms then add the new item to those forms
        otherwise it will show only the new added item (this.props.state[all].length will be true)
        so it will not request any data
      */
      if (state.forms['all'] && action.data.key !== 'sub-form') {
        /* show the new form added in both simplisend and the corresponding tree item in simpliadmin*/
        updatedForms = {
          ...state.forms ,
          [key] : updatedPart,
          'all' : state.forms['all'] ?
          [...state.forms['all'] , { ...action.data.form , index : state.forms['all'].length -1 }] :
          [{ ...action.data.form,index : 0 }],

        }

        return { ...state, forms : updatedForms , activeForm : { ...action.data.form,index : updatedPart.length -1 }}
      }


      return {
        ...state,
        forms : {...state.forms ,[key] : updatedPart},
        activeForm : { ...action.data.form,index : updatedPart.length -1 }
      }


    /* show the popup of adding new form */
    case 'SHOW_ADD_FORM_POPUP' :
       return { ...state , showAddPopup : action.data }

    case 'SHOW_COPY_FORM_POPUP' :
       return { ...state , showCopyFormPopup : action.data }


    /* which form is active now (could be none)*/
    case "SET_ACTIVE_FORM" :
      return { ...state,activeForm : action.data }

    /* show deletion message (when user wants to delete a form) */
    case 'SHOW_FORM_DELETION_POPUP' :
      return { ...state, showFormDeletionMessage : action.data }

    /* delete form */
    case 'REMOVE_FORM' :

      form = action.data.form ;
      type = action.data.key  ;
      updatedPart = state.forms[type].filter(item => item.id !== form.id )   ;

      if (state.forms['all']) {
        elementIndex  = findElement(state.forms['all'],action.data.form,0) ;
        updatedAllForms = [...state.forms['all']]
        updatedAllForms.splice(elementIndex,1) ;
        updatedForms = {
          ...state.forms ,
          [type] : updatedPart ,
          'all' : updatedAllForms ,
        }
      } else {
        updatedForms = {
          ...state.forms ,
          [type] : updatedPart ,
        }

      }


    return { ...state, forms : updatedForms , activeForm : null }

    /* when renaming a form */
    case 'UPDATE_ACTIVE_FORM' :

      key = action.data.key ;
      form = action.data.form ;

      updatedPart = [] ;

      state.forms[key].map(item => {

        if (item.id !== form.id) {
          updatedPart.push(item) ;
        } else {
          updatedPart.push(form)
        }
        return null
      })

      if (state.forms['all']) {
        elementIndex  = findElement(state.forms['all'],action.data.form,0) ;
        updatedAllForms = [...state.forms['all']]
        updatedAllForms[elementIndex] = { ...action.data.form }
        updatedForms = {
          ...state.forms ,
          [key] : updatedPart ,
          'all' : updatedAllForms ,
        }
      } else {
        updatedForms = {
          ...state.forms ,
          [key] : updatedPart ,
        }
      }




      return { ...state,activeForm : action.data.form,forms : updatedForms }

    /* when changing the privacy of a tag */
    case 'CHANGE_PRIVACY' :
      updatedForms =  { ...state.forms }
      updatedForms['all'] = action.data ;
      return { ...state,  forms : updatedForms }


    case "FORM_COPY" :
      return { ...state , copiedForm : action.data } ;


    case "PASTE_FORM"  :

      type = action.data.key ;
      form = action.data.form ;

      updatedPart = state.forms[type] ;
      if (updatedPart) {
        updatedPart.push(action.data.form) ;
      } else {
        updatedPart = [action.data.form] ;
      }
      return { ...state, forms : { ...state.forms , [type] : updatedPart }}


    case "REMOVE_FORMS" :

      updatedForms = {...state.forms }
      if (updatedForms[action.data]) {

        delete updatedForms[action.data]
      }
      return {...state, forms : updatedForms}


    default:
      return state ;
  }


}

export default saFormsReducer ;
