import {
  RECEIVE_COUNTRIES,
} from '../constants/countries';

const initialState = {
  countries: [],
};

export default function countries(state = initialState, { type, payload }) {
  switch (type) {
    case RECEIVE_COUNTRIES:
      return {
        ...state,
        countries: payload,
      };
    default:
      return state;
  }
}
