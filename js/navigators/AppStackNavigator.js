// Auth Stack Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createStackNavigator } from 'react-navigation-stack';

import { AppDrawerNavigator } from './AppDrawerNavigator';
import { SetupStackNavigator } from './SetupStackNavigator';
import { PrimeStackNavigator } from './PrimeStackNavigator';

export const AppStackNavigator = createStackNavigator({
  Setup: SetupStackNavigator,
  Prime: PrimeStackNavigator,
  AppDrawer: AppDrawerNavigator,
}, {
  initialRouteName: 'AppDrawer',
  headerMode: 'none',
})
