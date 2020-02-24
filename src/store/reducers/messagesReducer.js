const initState = {
  title : '',
  text : '',
  showMessage : false,
  showFormNamelessError : false ,
  showFormSaveWarning : false ,
}

const messageReducer = (state = initState ,action) => {
  switch (action.type) {

    case 'SET_MESSAGE_DATA':
      return { ...state, title : action.data.title,text : action.data.text,showMessage : action.data.showMessage }

    case "SHOW_ERROR" :
      return {...state , [action.data.key] : action.data.value}

    default:
      return state

  }
}

export default messageReducer  ;
