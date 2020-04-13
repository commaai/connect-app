import { Platform } from 'react-native';
import { userLocationUpdated }  from '../actions/location';
let watchId = null;

export function watchPosition(dispatch) {
  if (watchId !== null) {
    stopWatchingPosition();
  }

  if (Platform.OS === 'ios') {
    navigator.geolocation.requestAuthorization();
  }
  watchId = navigator.geolocation.watchPosition(locationUpdated, locationError, { enableHighAccuracy: true });
  navigator.geolocation.getCurrentPosition(locationUpdated, locationError, { enableHighAccuracy: true });

  function locationUpdated (location) {
    dispatch(userLocationUpdated(location));
  }

  function locationError(error) {
    if (Platform.OS === 'ios') {
      navigator.geolocation.requestAuthorization();
    }
    console.log('watchPosition error', error);
  }
}

export function stopWatchingPosition() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
}
