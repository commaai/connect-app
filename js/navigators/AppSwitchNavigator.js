// App Switch Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createSwitchNavigator } from 'react-navigation';

import AppLoader from '../screens/AppLoader/AppLoader';
import Terms from '../screens/Terms';
import MOTD from '../screens/MOTD';
import { AppStackNavigator } from './AppStackNavigator';
import { AuthStackNavigator } from './AuthStackNavigator';

export default createSwitchNavigator({
  AppLoader: AppLoader,
  Terms: Terms,
  MOTD: MOTD,
  App: AppStackNavigator,
  Auth: AuthStackNavigator,
}, {
  initialRouteName: 'AppLoader',
})
