// Navigators
import React from 'react';
import Segment from '@segment/analytics-react-native';
import AppSwitchNavigator from './AppSwitchNavigator';
import * as NavigationService from './service';
import { createAppContainer } from 'react-navigation';
let AppContainer = createAppContainer(AppSwitchNavigator);
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

export default () => (
  <AppContainer
    ref={ (navigatorRef) => NavigationService.setNavigator(navigatorRef) }
    onNavigationStateChange={(prevState, state, action) => {
      const screen = getActiveRouteName(state);
      const prevScreen = getActiveRouteName(prevState);

      if (prevScreen !== screen) {
        Segment.screen(screen);
      }
    } } />
);
