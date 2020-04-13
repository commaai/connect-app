// Drives Async Actions
// ~~~~~~~~~~~~~~~~~~~~
import * as Sentry from '@sentry/react-native';
import { drives as DrivesApi } from '@commaai/comma-api';
import * as Geocoding from '../../api/geocoding';

import {
  drivesReset,
  drivesFetchStarted,
  drivesFetchFailed,
  routesFetched,
  routeGeocodeFetched,
} from '../Drives';

export function fetchDrives(dongleId) {
  if (!dongleId) return;
  return (dispatch, getState) => {
    dispatch(drivesFetchStarted(dongleId));
    DrivesApi.fetchRoutes(dongleId, Date.now() - 86400*14*1000, Date.now()).then((routes) => {
      dispatch(routesFetched(dongleId, routes));
    }).catch((err) => {
      Sentry.captureException(err);
      console.log('drivesFetch failed', dongleId, err);
      dispatch(drivesFetchFailed(dongleId));
    });
  }
}

export function geocodeRoute(route, force = false) {
  return async (dispatch, getState) => {
    let { start, end } = (getState().drives.routeGeocodes[route.route] || {});
    if (force || !start) {
      try {
        start = await Geocoding.reverseLookup(route.startCoord);
        dispatch(routeGeocodeFetched(route, start));
      } catch(err) {
        Sentry.captureException(err);
        console.log('could not fetch start geocode', route.route, err);
      }
    }
    if (force || !end) {
      try {
        end = await Geocoding.reverseLookup(route.endCoord);
        dispatch(routeGeocodeFetched(route, start, end));
      } catch(err) {
        Sentry.captureException(err);
        console.log('could not fetch end geocode', route.route, err);
      }
    }
  }
}
