import { ACTION_USER_LOCATION_UPDATED } from '../actions/location';

const initialLocationState = {
  location: null,
};

export default function (state = initialLocationState, action) {
  switch(action.type) {
    case ACTION_USER_LOCATION_UPDATED:
      return {
        ...state,
        location: action.payload.location,
      }
    default:
      return state;
  }
}
