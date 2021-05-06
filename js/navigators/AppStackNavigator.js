// Auth Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import { AppDrawerNavigator } from './AppDrawerNavigator';
import { SetupStackNavigator } from './SetupStackNavigator';

export const AppStackNavigator = createStackNavigator({
  Setup: SetupStackNavigator,
  AppDrawer: AppDrawerNavigator,
}, {
  initialRouteName: 'AppDrawer',
  headerMode: 'none',
})
