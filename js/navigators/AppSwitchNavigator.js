// App Switch Navigator
// ~~~~~~~~~~~~~~~~~~~~

import { createSwitchNavigator } from 'react-navigation';

import AppLoader from '../screens/AppLoader/AppLoader';
import Terms from '../screens/Terms';
import ShareView from '../screens/ShareView';
import { AppStackNavigator } from './AppStackNavigator';
import { AuthStackNavigator } from './AuthStackNavigator';

export default createSwitchNavigator({
  AppLoader: AppLoader,
  Terms: Terms,
  App: AppStackNavigator,
  Auth: AuthStackNavigator,
  Share: ShareView,
}, {
  initialRouteName: 'AppLoader',
})
