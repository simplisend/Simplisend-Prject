const initState = { isAuthorized :  null  }

const authReducer = (state = initState,action) => {

  switch (action.type) {
    case 'AUTHORIZATION':
      return {...state, isAuthorized : action.data}


    default:
      return state ;

  }


}

export default authReducer
