// Devices Async Actions
// ~~~~~~~~~~~~~~~~~~~~~

import * as Sentry from '@sentry/react-native';
import {
  devices as DevicesApi,
  athena as AthenaApi,
} from '@commaai/comma-api';
import * as BillingApi from '../../api/billing';
import * as Geocoding from '../../api/geocoding';

import {
  deviceFetched,
  deviceLocationFetched,
  deviceLocationFetchFailed,
  deviceLocationFetchStarted,
  devicesFetched,
  devicesFetchFailed,
  devicesFetchStarted,
  deviceStatsFetched,
  devicePairFailed,
  deviceUnpaired,
  deviceSnapshotsUpdated,
  deviceCarHealthUpdated,
  deviceSubscriptionFetched,
} from '../Devices';

export function fetchDevices() {
  return (dispatch, getState) => {
    const isFetchingDevices = getState().devices.isFetchingDevices;
    if (isFetchingDevices) {
      return Promise.resolve();
    }
    dispatch(devicesFetchStarted());
    return DevicesApi.listDevices().then((devices) => {
      devices = devices.filter(device => device.device_type !== 'panda')
      const devicesById = devices.reduce((obj, device) => {
        device.fetched_at = parseInt(Date.now()/1000);
        obj[device.dongle_id] = device;
        return obj;
      }, {});
      dispatch(devicesFetched(devicesById));
      dispatch(fetchDeviceLocations());
      dispatch(fetchDeviceSubscriptions());
    }).catch((err) => {
      console.log('fetchDevices failed', err);
      Sentry.captureException(err);
      dispatch(devicesFetchFailed());
    });
  }
}

export function fetchDeviceLocations() {
  return (dispatch, getState) => {
    const { devices } = getState().devices;

    Object.values(devices).map((device) => {
      dispatch(deviceLocationFetchStarted(device.dongle_id));
      dispatch(fetchDeviceLocation(device.dongle_id));
    });
  }
}

export function fetchDeviceSubscriptions() {
  return (dispatch, getState) => {
    const { devices } = getState().devices;

    Object.values(devices).map((device) => {
      dispatch(fetchDeviceSubscription(device.dongle_id));
    });
  }
}
export function fetchDeviceLocation(dongleId) {
  return (dispatch, getState) => {
    const { devices } = getState().devices;

    let timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => reject('timeout'), 15000)
    });
    Promise.race([DevicesApi.fetchLocation(dongleId), timeoutPromise])
      .then((location) => {
        dispatch(deviceLocationFetched(dongleId, location));
        return Geocoding.reverseLookup([location.lng, location.lat]).then(reverseGeo => dispatch(deviceLocationFetched(dongleId, location, reverseGeo)))
      }).catch((err) => {
        console.log('fetchDeviceLocations failed', err);
        dispatch(deviceLocationFetchFailed(dongleId));
    })
  }
}

export function fetchDeviceSubscription(dongleId) {
  return async (dispatch, getState) => {
    try {
      const sub = await BillingApi.getSubscription(dongleId);
      dispatch(deviceSubscriptionFetched(dongleId, sub));
      return sub;
    } catch(err) {
      if (err.status_code === 404) {
        dispatch(deviceSubscriptionFetched(dongleId, null));
      } else {
        console.log(`fetchDeviceSubscription(${dongleId}) failed`, err.message, err.status_code);
      }
      return null;
    }
  }
}

export function pilotPair(imei, serial, pairToken) {
  return async dispatch => {
    try {
      const resp = await DevicesApi.pilotPair(imei, serial, pairToken);
      return JSON.parse(resp).dongle_id;
    } catch(err) {
      Sentry.captureException(err);
      console.log('pilotPair failed', {imei, serial, pairToken}, err);
      throw err;
    }
  }
}

export function fetchDevice(dongleId) {
  return async (dispatch, getState) => {
    let device = await DevicesApi.fetchDevice(dongleId);
    dispatch(deviceFetched(device));
    return device;
  }
}

export function fetchDeviceStats(dongleId) {
  return async (dispatch, getState) => {
    try {
      const stats = await DevicesApi.fetchDeviceStats(dongleId);
      dispatch(deviceStatsFetched(dongleId, stats));
    } catch(err) {
      Sentry.captureException(err);
      console.log('device stats fetch failed', dongleId, err);
    }
  }
}

export function unpairDevice(dongleId) {
  return async dispatch => {
    try {
      await DevicesApi.unpair(dongleId);
      dispatch(deviceUnpaired(dongleId));
    } catch(err) {
      Sentry.captureException(err);
      console.log('unpairDevice failed', dongleId, err);
    }
  }
}

export function takeDeviceSnapshot(dongleId) {
  return async dispatch => {
    try {
      const resp = await AthenaApi.postJsonRpcPayload(dongleId, {
        method: "takeSnapshot",
        jsonrpc: "2.0",
        id: 0,
      });
      if ('error' in resp) {
        let error = { message: resp.error.message };
        if (resp.error.message === "Method not found") {
          error.message = "Snapshot requires device version 0.6.5 or newer. Please upgrade and try again.";
        } else {
          error.message = "Snapshot unavailable.";
        }
        dispatch(deviceSnapshotsUpdated(dongleId, error));
      } else {
        dispatch(deviceSnapshotsUpdated(dongleId, resp.result));
      }
    } catch(err) {
      console.log(err);
      dispatch(deviceSnapshotsUpdated(dongleId, { message: 'Snapshot unavailable.' }));
    }
  }
}

export function fetchDeviceCarHealth(dongleId) {
  return async dispatch => {
    try {
      const resp = await AthenaApi.postJsonRpcPayload(dongleId, {
        method: 'getMessage',
        params: {'service': 'pandaState', 'timeout': 5000},
        jsonrpc: '2.0',
        id: 0,
      })
      if ('error' in resp) {
        let error = { message: resp.error.message };
        dispatch(deviceCarHealthUpdated(dongleId, error));
      } else {
        dispatch(deviceCarHealthUpdated(dongleId, resp.result));
      }
    } catch(err) {
      console.log(err);
    }
  }
}

export function setDeviceAlias(dongleId, alias) {
  return async dispatch => {
    try {
      const updatedDevice = await DevicesApi.setDeviceAlias(dongleId, alias);
      dispatch(deviceFetched(updatedDevice));
    } catch(err) {
      console.log(err);
    }
  }
}
