import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { userLocationUpdated }  from '../actions/location';

Geolocation.setRNConfiguration({
  authorizationLevel: 'whenInUse',
});

let watchId = null;

export function watchPosition(dispatch) {
  if (watchId !== null) {
    stopWatchingPosition();
  }

  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
  }
  watchId = Geolocation.watchPosition(locationUpdated, locationError, { enableHighAccuracy: true });
  Geolocation.getCurrentPosition(locationUpdated, locationError, { enableHighAccuracy: true });

  function locationUpdated (location) {
    dispatch(userLocationUpdated(location));
  }

  function locationError(error) {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
    }
    console.log('watchPosition error', error);
  }
}

export function stopWatchingPosition() {
  if (watchId !== null) {
    Geolocation.clearWatch(watchId);
  }
}
