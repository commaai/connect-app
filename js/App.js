/**
 * comma Connect React Native App
 * https://github.com/commaai/connect
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { AppState, StatusBar } from 'react-native';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist'
import reduxPerfMiddleware from './utils/reduxPerfMiddleware';
import RootReducer from './reducers';
import { rehydrateAuth } from './actions/async/Auth';
import { watchPosition } from './utils/location';
import NavAppContainer from './navigators/app';
import ShareMenu from 'react-native-share-menu';
import { setShareState } from './actions/share';

// Redux
function createAppStore(shouldAutoRehydrate = true) {
  let transforms;
  if (shouldAutoRehydrate) {
    if (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      transforms = compose(applyMiddleware(
                    thunk,
                    reduxPerfMiddleware),
                    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
    } else {
      transforms = compose(applyMiddleware(thunk));
    }
  } else {
    transforms = applyMiddleware(thunk);
  }
  const store = createStore(RootReducer, undefined, transforms);

  return store;
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      storeIsReady: false,
      appState: AppState.currentState,
    }

    this.initStore = this.initStore.bind(this);
    const store = createAppStore();
    this.store = store;
    this.persistor = persistStore(this.store, null, (err, newState) => {
      this.initStore(err, newState)
    });
    this._handleAppStateChange = this._handleAppStateChange.bind(this);

    this.shareListener = null;
    this.shareCallback = this.shareCallback.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    watchPosition(this.store.dispatch);

    ShareMenu.getInitialShare(this.shareCallback);
    this.shareListener = ShareMenu.addNewShareListener(this.shareCallback);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);

    if (this.shareListener) {
      this.shareListener.remove();
    }
  }

  shareCallback(share) {
    if (share && share.data) {
      console.log("share", share);
      this.store.dispatch(setShareState(share));
    }
  }

  _handleAppStateChange(appState) {
    if (appState === 'active' && this.state.appState.match(/inactive|background/)) {
      this.setState({ appState });
      setTimeout(() => watchPosition(this.store.dispatch), 500);
    }
  }

  async initStore(err, newState) {
    if (err) {
      this.persistor.purge();
      const store = createAppStore(false);
      this.store = store;
    }

    await this.store.dispatch(rehydrateAuth());
    this.setState({ storeIsReady: true });
  }

  render() {
    return (
      <Provider store={ this.store }>
        {this.state.storeIsReady && <NavAppContainer /> }
        <StatusBar barStyle='light-content' />
      </Provider>
    );
  }
}
