import titles from '../../configs/title' ;

/*  if user has selected language then set it as the default one else english is the default */
const defaultLang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en' ;


const initState = { lang : defaultLang,titles : titles[defaultLang] } ;


const langReducer = (state = initState,action) => {

  switch (action.type) {

    /* change the language */
    case 'LANG':
      return { ...state,lang : action.data,titles : titles[action.data] }

    default:
      return state ;

  }


}

export default langReducer ;
