import { get } from 'axios';
import {
  ROOT,
  RECEIVE_COUNTRIES,
} from '../constants/countries';
/* eslint no-console: ["error", { allow: ["log", "error"] }] */
export default function receiveCountries() {
  return dispatch => get(ROOT)
    .then(({ data }) => dispatch({
      type: RECEIVE_COUNTRIES,
      payload: data.map(({ name }) => name),
    }))
    .catch(console.error);
}
