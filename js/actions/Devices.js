// Devices Static Actions
// ~~~~~~~~~~~~~~~~~~~~~~~
import moment from 'moment';

export const ACTION_DEVICES_RESET = 'ACTION_DEVICES_RESET';
export const ACTION_DEVICES_FETCH_STARTED = 'ACTION_DEVICES_FETCH_STARTED';
export const ACTION_DEVICES_FETCH_FAILED = 'ACTION_DEVICES_FETCH_FAILED';
export const ACTION_DEVICES_FETCHED = 'ACTION_DEVICES_FETCHED';
export const ACTION_DEVICE_SETUP_STARTED = 'ACTION_DEVICE_SETUP_STARTED';
export const ACTION_DEVICE_SETUP_FINISHED = 'ACTION_DEVICE_SETUP_FINISHED';
export const ACTION_DEVICE_LOCATION_FETCHED = 'ACTION_DEVICE_LOCATION_FETCHED';
export const ACTION_DEVICE_LOCATION_FETCH_STARTED = 'ACTION_DEVICE_LOCATION_FETCH_STARTED';
export const ACTION_DEVICE_LOCATION_FETCH_FAILED = 'ACTION_DEVICE_LOCATION_FETCH_FAILED';
export const ACTION_DEVICE_SELECTED = 'ACTION_DEVICE_SELECTED';
export const ACTION_DEVICE_FETCHED = 'ACTION_DEVICE_FETCHED';
export const ACTION_DEVICE_STATS_FETCHED = 'ACTION_DEVICE_STATS_FETCHED';
export const ACTION_DEVICE_UNPAIRED = 'ACTION_DEVICE_UNPAIRED';
export const ACTION_DEVICE_SNAPSHOT_UPDATED = 'ACTION_DEVICE_SNAPSHOT_UPDATED';
export const ACTION_DEVICE_CAR_HEALTH_UPDATED = 'ACTION_DEVICE_CAR_HEALTH_UPDATED';
export const ACTION_DEVICE_SUBSCRIPTION_FETCHED = 'ACTION_DEVICE_SUBSCRIPTION_FETCHED';

export function deviceSubscriptionFetched(dongleId, subscription) {
  return {
    type: ACTION_DEVICE_SUBSCRIPTION_FETCHED,
    payload: {
      dongleId,
      subscription,
    }
  }
}

export function resetDevices() {
  return {
    type: ACTION_DEVICES_RESET,
  }
}

export function devicesFetchStarted() {
  return {
    type: ACTION_DEVICES_FETCH_STARTED,
  };
}

export function devicesFetchFailed() {
  return {
    type: ACTION_DEVICES_FETCH_FAILED,
  };
}

export function devicesFetched(devices) {
  return {
    type: ACTION_DEVICES_FETCHED,
    payload: {
      devices,
    },
  };
}

export function deviceLocationFetchStarted(dongleId) {
  return {
    type: ACTION_DEVICE_LOCATION_FETCH_STARTED,
    payload: { dongleId },
  };
}

export function deviceLocationFetchFailed(dongleId) {
  return {
    type: ACTION_DEVICE_LOCATION_FETCH_FAILED,
    payload: { dongleId, }
  };
}

export function deviceLocationFetched(dongleId, location, geocode) {
  return {
    type: ACTION_DEVICE_LOCATION_FETCHED,
    payload: { dongleId, location, geocode },
  };
}

export function deviceFetched(device) {
  device.fetched_at = parseInt(Date.now()/1000);
  return {
    type: ACTION_DEVICE_FETCHED,
    payload: {
      device,
    },
  }
}

export function deviceStatsFetched(dongleId, stats) {
  return {
    type: ACTION_DEVICE_STATS_FETCHED,
    payload: {
      dongleId,
      stats,
    },
  }
}

export function devicePairFailed(err) {
  return {
    type: '',
    payload: {
      err,
    }
  }
}

export function deviceUnpaired(dongleId) {
  return {
    type: ACTION_DEVICE_UNPAIRED,
    payload: { dongleId }
  }
}

export function deviceSnapshotsUpdated(dongleId, data) {
  return {
    type: ACTION_DEVICE_SNAPSHOT_UPDATED,
    payload: {
      dongleId,
      snapshot: {
        jpegBack: data.jpegBack,
        jpegFront: data.jpegFront,
        message: data.message,
        time: Date.now(),
      },
    },
  }
}

export function deviceCarHealthUpdated(dongleId, carHealth) {
  return {
    type: ACTION_DEVICE_CAR_HEALTH_UPDATED,
    payload: {
      dongleId,
      carHealth,
    },
  }
}
