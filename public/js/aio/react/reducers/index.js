import { combineReducers } from 'redux'
import drawer_reducer from './drawer_reducer'
import personal_reducer from './personal_reducer'

export default combineReducers({
    personalReducer: personal_reducer,
    drawerReducer: drawer_reducer
})