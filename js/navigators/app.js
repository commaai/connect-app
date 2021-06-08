// Navigators
import React, { Component } from 'react';
import Segment from '@segment/analytics-react-native';
import AppSwitchNavigator from './AppSwitchNavigator';
import * as NavigationService from './service';
import { createAppContainer, NavigationActions } from 'react-navigation';
import ShareMenu from 'react-native-share-menu';

const AppContainer = createAppContainer(AppSwitchNavigator);

class AppContainerNavigator extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.navigationStateChange = this.navigationStateChange.bind(this);
    this.getActiveRouteName = this.getActiveRouteName.bind(this);

    this.shareListener = null;
    this.shareCallback = this.shareCallback.bind(this);
  }

  componentDidMount() {
    ShareMenu.getInitialShare(this.shareCallback);
    this.shareListener = ShareMenu.addNewShareListener(this.shareCallback);
  }

  componentWillUnmount() {
    if (this.shareListener) {
      this.shareListener.remove();
    }
  }

  shareCallback(share) {
    if (share && share.data) {
      console.log("share", share);
      this.navContainer.dispatch(NavigationActions.navigate({ routeName: 'Share' }));
    }
  }

  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }

  navigationStateChange(prevState, state, action) {
    const screen = this.getActiveRouteName(state);
    const prevScreen = this.getActiveRouteName(prevState);

    if (prevScreen !== screen) {
      Segment.screen(screen);
    }
  }

  render() {
    return (
      <AppContainer ref={ (ref) => this.navContainer = ref }
        onNavigationStateChange={ this.navigationStateChange } />
    );
  }
}

export default AppContainerNavigator;
