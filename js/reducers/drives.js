// Drives Reducer
// ~~~~~~~~~~~~~~

import {
  ACTION_DRIVES_RESET,
  ACTION_DRIVES_FETCH_STARTED,
  ACTION_DEVICE_ROUTES_FETCHED,
  ACTION_DRIVES_FETCH_FAILED,
  ACTION_ROUTE_GEOCODE_FETCHED,
} from '../actions/Drives';

const initialDrivesState = {
  isLoadingByDevice: {},
  routesByDevice: {},
  routeGeocodes: {},
};

export default function drives(state = initialDrivesState, action) {
  switch(action.type) {
    case ACTION_DRIVES_RESET:
      return {
        ...initialDrivesState,
      };
      break;
    case ACTION_DRIVES_FETCH_STARTED:
      return {
        ...state,
        isLoadingByDevice: {
          ...state.isLoadingByDevice,
          [action.payload.dongleId]: true
        },
      };
      break;
    case ACTION_DEVICE_ROUTES_FETCHED:
      return {
        ...state,
        routesByDevice: {
          ...state.routesByDevice,
          [action.payload.dongleId]: action.payload.routes,
        },
        isLoadingByDevice: {
          ...state.isLoadingByDevice,
          [action.payload.dongleId]: false
        },
      }
    case ACTION_DRIVES_FETCH_FAILED:
      return {
        ...state,
        isLoadingByDevice: {
          ...state.isLoadingByDevice,
          [action.payload.dongleId]: false
        },
      };
      break;
    case ACTION_ROUTE_GEOCODE_FETCHED:
      return {
        ...state,
        routeGeocodes: {
          ...state.routeGeocodes,
          [action.payload.route.route]: {
            start: action.payload.startGeocode || (state.routeGeocodes[action.payload.route.route] || {}).start,
            end: action.payload.endGeocode || (state.routeGeocodes[action.payload.route.route] || {}).end,
          },
        },
      }
    default:
      return state;
  }
}
