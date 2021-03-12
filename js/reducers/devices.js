// Devices Reducers
// ~~~~~~~~~~~~~~~~

import {
  ACTION_DEVICES_RESET,
  ACTION_DEVICES_FETCH_STARTED,
  ACTION_DEVICES_FETCH_FAILED,
  ACTION_DEVICES_FETCHED,
  ACTION_DEVICE_SETUP_STARTED,
  ACTION_DEVICE_SETUP_FINISHED,
  ACTION_DEVICE_LOCATION_FETCH_STARTED,
  ACTION_DEVICE_LOCATION_FETCH_FAILED,
  ACTION_DEVICE_LOCATION_FETCHED,
  ACTION_DEVICE_SELECTED,
  ACTION_DEVICE_FETCHED,
  ACTION_DEVICE_STATS_FETCHED,
  ACTION_DEVICE_UNPAIRED,
  ACTION_DEVICE_SNAPSHOT_UPDATED,
  ACTION_DEVICE_CAR_HEALTH_UPDATED,
  ACTION_DEVICE_SUBSCRIPTION_FETCHED,
} from '../actions/Devices';

import {
  removeKey
} from '../utils/object';
import { isDeviceOnline } from '../utils/device';
import { REHYDRATE } from 'redux-persist';

const initialDevicesState = {
  isFetchingDevices: false,
  isSettingUpDevice: false,
  devicesRefreshedAt: null,
  devices: {},
  deviceStats: {},
  devicesDriveTimeSorted: [],
  deviceLocations: {},
  deviceSnapshots: {},
  activeDeviceLocationFetches: {},
  subscriptions: {},
};

export default function devices(state = initialDevicesState, action) {
  switch (action.type) {
    case ACTION_DEVICES_RESET:
      return {
        ...initialDevicesState,
      }
    case ACTION_DEVICES_FETCH_STARTED:
      return {
        ...state,
        isFetchingDevices: true,
      }
    case ACTION_DEVICES_FETCHED:
      const { devices } = action.payload;

      return {
        ...state,
        isFetchingDevices: false,
        devices,
        devicesDriveTimeSorted: Object.values(devices)
          .sort((d1, d2) => (isDeviceOnline(d2) | 0)  - (isDeviceOnline(d1) | 0))
          .map(d => d.dongle_id),
        deviceLocations: Object.entries(state.deviceLocations)
          .filter(([dongleId, location]) => devices[dongleId] != null)
          .reduce((locs, [dongleId, location]) => ({...locs, [dongleId]: location}), {})
      }
    case ACTION_DEVICE_LOCATION_FETCH_STARTED:
      return {
        ...state,
        activeDeviceLocationFetches: {
          ...state.activeDeviceLocationFetches,
          [action.payload.dongleId]: Date.now()
        },
        isFetchingDeviceLocation: true,
      }
    case ACTION_DEVICE_LOCATION_FETCH_FAILED:
      return {
        ...state,
        activeDeviceLocationFetches: removeKey(state.activeDeviceLocationFetches, action.payload.dongleId),
        isFetchingDeviceLocation: Object.keys(state.activeDeviceLocationFetches).length > 1,
      }
    case ACTION_DEVICE_LOCATION_FETCHED:
      return {
        ...state,
        activeDeviceLocationFetches: removeKey(state.activeDeviceLocationFetches, action.payload.dongleId),
        deviceLocations: {
          ...state.deviceLocations,
          [action.payload.dongleId]: {
            ...action.payload.location,
            ...(action.payload.geocode || {})
          },
        },
        isFetchingDeviceLocation: Object.keys(state.activeDeviceLocationFetches).length > 1,
      }
    case ACTION_DEVICES_FETCH_FAILED:
      return {
        ...state,
        isFetchingDevices: false,
      }
    case ACTION_DEVICE_SETUP_STARTED:
      return {
        ...state,
        isSettingUpDevice: true,
      }
    case ACTION_DEVICE_SETUP_FINISHED:
      return {
        ...state,
        isSettingUpDevice: false,
      }
    case ACTION_DEVICE_FETCHED:
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload.device.dongle_id]: action.payload.device,
        },
      }
    case ACTION_DEVICE_STATS_FETCHED:
      return {
        ...state,
        deviceStats: {
          ...state.deviceStats,
          [action.payload.dongleId]: action.payload.stats,
        },
      }
    case ACTION_DEVICE_UNPAIRED:
      return {
        ...state,
        devices: removeKey(state.devices, action.payload.dongleId),
        deviceLocations: removeKey(state.deviceLocations, action.payload.dongleId),
        devicesDriveTimeSorted: state.devicesDriveTimeSorted.filter(dongleId => dongleId !== action.payload.dongleId),
        subscriptions: removeKey(state.subscriptions, action.payload.dongleId)
      }
    case ACTION_DEVICE_SNAPSHOT_UPDATED:
      return {
        ...state,
        deviceSnapshots: { ...state.deviceSnapshots, [action.payload.dongleId]: action.payload.snapshot }
      }
    case ACTION_DEVICE_CAR_HEALTH_UPDATED:
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.payload.dongleId]: {
            ...state.devices[action.payload.dongleId],
            carHealth: action.payload.carHealth.pandaState,
          },
        },
      }
    case ACTION_DEVICE_SUBSCRIPTION_FETCHED:
      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [action.payload.dongleId]: action.payload.subscription
        }
      }
    case REHYDRATE:
      if (action.key === 'devices') {
        return {
          ...state,
          devices: ((action.payload && action.payload.devices) || {}),
          deviceStats: {},
          isFetchingDevices: false,
          activeDeviceLocationFetches: {},
        }
      } else {
        return state;
      }
    default:
      return state;
  }
}
