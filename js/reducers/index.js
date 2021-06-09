import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import FilesystemStorage from 'redux-persist-filesystem-storage';

import auth from './auth';
import drives from './drives';
import location from './location';
import devices from './devices';
import share from './share';

const persistConfig = (key, options) => ({
    key,
    storage: FilesystemStorage,
    debug: __DEV__ && true,
    blacklist: (options && options.blacklist) || [],
});

const RootReducer = combineReducers({
  auth: persistReducer(persistConfig('auth'), auth),
  drives: persistReducer(persistConfig('drives', { blacklist: ['isFetchingDrives'] }), drives),
  location,
  devices: persistReducer(persistConfig('devices', { blacklist: ['isFetchingDevices', 'activeDeviceLocationFetches']}), devices),
  share,
});

export default RootReducer;
