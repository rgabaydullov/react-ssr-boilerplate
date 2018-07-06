import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';

let initialState = {};
if (typeof window !== 'undefined') {
  initialState = '__INITIAL_STATE__' in window
    ? window.__INITIAL_STATE__ // eslint-disable-line no-underscore-dangle
    : {};
}
export default createStore(rootReducer, initialState, applyMiddleware(reduxThunk));
