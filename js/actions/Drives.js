// Drives Static Actions
// ~~~~~~~~~~~~~~~~~~~~~

export const ACTION_DRIVES_RESET = 'ACTION_DRIVES_RESET';
export const ACTION_DRIVES_FETCH_STARTED = 'ACTION_DRIVES_FETCH_STARTED';
export const ACTION_DEVICE_ROUTES_FETCHED = 'ACTION_DEVICE_ROUTES_FETCHED';
export const ACTION_DRIVES_FETCH_FAILED = 'ACTION_DRIVES_FETCH_FAILED';
export const ACTION_ROUTE_GEOCODE_FETCHED = 'ACTION_ROUTE_GEOCODE_FETCHED';

export function resetDrives() {
  return {
    type: ACTION_DRIVES_RESET,
  };
}

export function drivesFetchStarted(dongleId) {
  return {
    type: ACTION_DRIVES_FETCH_STARTED,
    payload: {
      dongleId,
    }
  };
}

export function routesFetched(dongleId, routes) {
  return {
    type: ACTION_DEVICE_ROUTES_FETCHED,
    payload: {
      dongleId,
      routes
    },
  };
}

export function drivesFetchFailed(dongleId) {
  return {
    type: ACTION_DRIVES_FETCH_FAILED,
    payload: {
      dongleId,
    }
  };
}

export function routeGeocodeFetched(route, startGeocode, endGeocode) {
  return {
    type: ACTION_ROUTE_GEOCODE_FETCHED,
    payload: {
      route,
      startGeocode,
      endGeocode,
    }
  }
}
