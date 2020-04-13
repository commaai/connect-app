// App Switch Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createSwitchNavigator } from 'react-navigation';

import AppLoader from '../screens/AppLoader/AppLoader';
import Terms from '../screens/Terms';
import { AppStackNavigator } from './AppStackNavigator';
import { AuthStackNavigator } from './AuthStackNavigator';

export default createSwitchNavigator({
  AppLoader: AppLoader,
  Terms: Terms,
  App: AppStackNavigator,
  Auth: AuthStackNavigator,
}, {
  initialRouteName: 'AppLoader',
})
