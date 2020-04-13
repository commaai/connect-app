// App Drawer Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createDrawerNavigator } from 'react-navigation';

import { DeviceStackNavigator } from './DeviceStackNavigator';
import AppDrawer from '../screens/AppDrawer';

export const AppDrawerNavigator = createDrawerNavigator({
  DeviceStack: DeviceStackNavigator,
}, {
  initialRouteName: 'DeviceStack',
  headerMode: 'none',
  contentComponent: AppDrawer,
})
