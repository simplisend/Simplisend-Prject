import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './reducers/index'
import Paint from './src/paint'
import { Root } from "native-base";
export const store = createStore(reducer);
